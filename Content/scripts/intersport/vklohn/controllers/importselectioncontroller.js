if (Object.isUndefined(Intersport) || !Intersport) { var Intersport = {}; }
if (Object.isUndefined(Intersport.VKLOHN) || !Intersport.VKLOHN) { Intersport.VKLOHN = {}; }

/**
 */
Intersport.VKLOHN.ImportSelectionController = Control.extend(/** @lends Intersport.VKLOHN.ImportSelectionController# */{

  /**
   * ImportSelection Controller
   * @class Intersport.VKLOHN.ImportSelectionController
   * @augments Control
   * @constructs
   */
  init: function(element, options) {
    var that = this;
    this._super(element, options);

    // Members
    this.$toolbar = $('.toolbar');
    this.$form = $('form#ImportDataForm');
    this.$form.ajaxForm({
      success: this.onFormSubmitted.bind(this),
      dataType: 'json'});
  },

  /**
   * Controlbaum ist aufgebaut.
   * @param callback Wird aufgerufen, wenn onReady fertig ist.
   */
  onReady: function(callback) {
    var that = this;

    // Controls
    this.sidebar = app.findControl('sidebar');
    this.panel = this.findControl('ImportData');

    // Sidebar öffnen.
    this.sidebar.open();

    // Speichern
    this.$toolbar.find('a.submit').click(function(e) {
      $.blockUI(txt.Die_Daten_werden_gespeichert);
      that.$form.submit();
      return false;
    });

    this._super(callback);
  },

  /**
   * Wird aufgerufen, wenn der Filter gesetzt werden soll.
   * @param msg Enthält die Antwort vom Server ({type, message}).
   */
  onFormSubmitted: function(msg) {
    $.unblockUI();
    message.show(msg);
  }

});
