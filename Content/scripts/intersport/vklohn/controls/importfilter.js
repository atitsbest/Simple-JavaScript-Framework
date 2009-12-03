/**
 * @namespace Intersport.VKLOHN
 */
if (Object.isUndefined(Intersport) || !Intersport) { var Intersport = {}; }
if (Object.isUndefined(Intersport.VKLOHN) || !Intersport.VKLOHN) { Intersport.VKLOHN = {}; }

/**
 * Der Importfilter.
 * @class
 */
Intersport.VKLOHN.ImportFilter = Control.extend({

  /**
   * CTR
   */
  init: function(element, options) {
    this._super(element, options);

    // Elements
    this.$form = this.$element.find('form:first');
    this.$codeInputs = this.$element.find('.code');
    this.$companyNumberInput = this.$element.find('#CompanyNumber');
    this.$setFilterButton = this.$element.find('.setFilter');
    this.$clearFilterButton = this.$element.find('.clearFilter');
  },

  /**
   * Wenn der Controlbaum aufgebaut wurde.
   */
  onReady: function() {
    var that = this;

    // Events registrieren.
    this.$clearFilterButton.click(function(e) { that.clearFilter(e); return false; });
    this.$form.ajaxForm({
      success: this.onFormSubmitted.bind(this),
      dataType: 'json'});

    this._super();
  },

  /**
   * Wird aufgerufen, wenn der Filter gesetzt werden soll.
   * @param msg Enthält die Antwort vom Server ({type, message}).
   */
  onFormSubmitted: function(msg) {
    this.reloadDependencies();
    message.show(msg);
  },

  /**
   * Wird aufgerufen, wenn der Filter wieder gelöscht werden soll.
   */
  clearFilter: function(e) {
    var that = this;

    $.ajax({
      type: "POST",
      url: e.target.href,
      dataType: 'json',
      success: function(msg) {
        // Form löschen.
        that.$codeInputs.val('');
        that.$companyNumberInput.val('0');

        that.reloadDependencies();

        message.show(msg);
      }
    });
  },

  /**
   * Kümmert sich um alles, was von dem Filter abhängt und eventuell neu geladen werden soll
   */
  reloadDependencies: function() {
    //eventuell das Panel der importierten Daten neu laden
    var $dataToReload = app.findControl('ImportData');
    if ($dataToReload) $dataToReload.load();
  }

});