/**@namespace Base.Controls*/
Base.namespace('Base.Controls');

Base.Controls.Tree = new Class(/** @lends Base.Controls.Tree# */{

	/**@ignore*/
	Extends: Base.Control,

	/**@ignore*/
	Implements: Events,

  /**
   * Funktionalität für einen Baum.
   * + Ein Knoten soll aus-/abwählbar sein.
   * + Wird ein Knoten aus-/abgewählt sollen alle Kinder aus-/abgewählt werden.
   * - Sind alle Kinder eines Knoten ausgewählt ist der Knoten selber ausgewählt.
   * - Sind einige aber nicht alle Kinder eines Knoten ausgewählt ist der Knoten selber halb ausgewählt.
   * - Sind keine Kinder eines Knoten ausgewählt ist der Knoten selber nicht ausgewählt.
   * @class Base.Controls.Tree
	 * @extends Base.Control
	 * @extends Events
   * @constructs
   * @param element HTML-Element für diese Control.
   * @param options Kombination aus Metadata element und Metadata unter dem Element.
   */
  init: function(element, options) {
    this.parent(element, options);
  },

  /**
   * Wenn der Controlbaum aufgebaut wurde.
   */
  onReady: function() {
    var that = this;

    // Ein Klick für alle Controls.
    this.$element.unbind('click').click(this.onClick.bind(this));

    this.parent();
  },

  /**
   * Ein Klick für alle Controls innerhalb des Baums,
   * damit das Teil besser skaliert.
   * @param e Eventstruktur des Browsers.
   */
  onClick: function(e) {
  	var $target = $(e.target);
    if ($target.is('.expanded')) {
      this.colapseBranch($target);
    }
    else if ($target.is('.colapsed')) {
      this.expandBranch($target);
    }
    else if ($target.is('.checkbox,input')) {
      this.onSelectionChanged($target);        
    }
    else {
      this.fireEvent('nodeClicked',$target);
    }
  },

  /**
   * Wenn sich die Auswahl (Checkboxen) geändert hat.
   * @param $checkbox Die Checkbox deren Status geändert wurde.
   */
  onSelectionChanged: function(/**jQuery*/$checkbox, check) {
    var that = this;
    // Wird ein Knoten aus-/abgewählt sollen alle Kinder aus-/abgewählt werden.
    this.changeSelection($checkbox, check, function() {
      that.fireEvent('selectionChanged');
    });    
  },

  /**
   * Die Auswahl einer Checkbox ändern und Parents und Children berücksichtigen
   * @param $checkbox Die Checkbox deren Status geändert wurde.
   * @param check false = abwählen, true = anwählen, undefined = toggle 
   * @param callback wird aufgerufen, wenn asynchroner Aufruf beendet
   */
  changeSelection: function($checkbox, check, /**function*/callback) {
    var that = this;
    // Status der Checkbox ändern.
    if (check == false)
      TristateCheckbox.uncheck($checkbox);
    else if (check == true)
      TristateCheckbox.check($checkbox);
    else
      TristateCheckbox.toggle($checkbox);

    // Wird ein Knoten aus-/abgewählt sollen alle Kinder aus-/abgewählt werden.
    this._updateChildSelection($checkbox, function() {
      window.setTimeout(function() {
        that._updateParentSelection($checkbox);
        if(callback) callback();
      }, 5);
    });
  },

  /**
   * Knoten ausklappen.
   * @param $target Open/Close des Knotens.
   */
   expandBranch: function(/**jQuery*/$target) {
    $target.siblings('ol').show();
    $target
      .addClass('hide')
      .siblings('.expanded').removeClass('hide');
   },

  /**
   * Knoten einklappen.
   * @param $target Open/Close des Knotens.
   */
  colapseBranch: function(/**jQuery*/$target) {
    $target.siblings('ol').hide();
    $target
      .addClass('hide')
      .siblings('.colapsed').removeClass('hide');
  },

  /**
   * Entfernt ein Element aus dem Baum, mitsamt aller Eltern.
   * @param $li
   */
  removeNode: function(/**jQuery*/$li) {
    if (!$li.is('li'))
      return;

    var $parent_li = $li.parent().parent();
    $li.remove();
    this._updateParentSelection($parent_li);

    // Hat der Parent keine Kinder mehr?
    if ($parent_li.find('ol > li').length == 0) {
      this.removeNode($parent_li);
    }
  },
  
  /**
   * Wird ein Knoten aus-/abgewählt sollen alle Kinder aus-/abgewählt werden.
   * @param $checkbox jQuery-Element der Checkbox
   * @param callback Wird aufgerufen, die Statusänderung bei allen Kindern abgeschlossen ist.
   */
  _updateChildSelection: function(/**jQuery*/$checkbox, /**function*/callback) {
    var checked = TristateCheckbox.isChecked($checkbox);
    var completeCount = 0;
    var $children = $checkbox.siblings('ol').find('li > .checkbox,li > input');

    // Wird aufgerufen, wenn ein Kind den Status fertig geändert hat.
    // Wenn alle Kinder fertig sind, ruf die Funktion die callback auf.
    function complete() {
      if ((completeCount +=1) > $children.length) {
        callback();
      }
    }

    // Status der Kinder aktualisieren.
    $children.each(function(i, child) {
      window.setTimeout(function() {
        if (checked) {
          TristateCheckbox.check($(child));
        } else {
          TristateCheckbox.uncheck($(child));
        }
        complete();
      }, i);
    });

    // Wenn es keine Kinder gibt, wollen wir dennoch das die
    // callback aufgerufen wird.
    complete();
  },

  /**
   * Sind alle Kinder eines Knoten ausgewählt ist der Knoten selber ausgewählt.
   * Sind einige aber nicht alle Kinder eines Knoten ausgewählt ist der Knoten selber halb ausgewählt.
   * Sind keine Kinder eines Knoten ausgewählt ist der Knoten selber nicht ausgewählt.
   * @param $checkbox
   * @private
   */
  _updateParentSelection: function(/**jQuery*/$checkbox) {
    var that = this;

    // 1. Parent ermitteln.
    var $parent = $checkbox.parent().parent().siblings('.checkbox,input');
    if ($parent.length > 0) {
      // 2. Status aller Geschwister ermitteln
      var state;
      $parent.siblings('ol').find('li > .checkbox,li > input').each(function(i, span) {
        var $span = $(span);
        state = (state)
          ? state = that._combineSelectionState(state, TristateCheckbox.getState($span))
          : state = TristateCheckbox.getState($span);
      });

      // 3. Parent status setzen
      TristateCheckbox.setState($parent, state);

      // 5. Rekursion für den Parent.
      this._updateParentSelection($parent);
    }
  },

  /**
   * Kombiniert zwei Stati zu einem Dritten der aus beiden besteht.
   * @param s1 Status Eins (checked,unchecked,partly).
   * @param s2 Status Zwei (checked,unchecked,partly).
   * @returns {String} (checked,unchecked,partly)
   * @private
   */
  _combineSelectionState: function(/**String*/s1, /**String*/s2) {
    return s1 == s2
      ? s1
      : 'partly';
  }

});