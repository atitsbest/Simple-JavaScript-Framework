if (Object.isUndefined(Intersport) || !Intersport) { var Intersport = {}; }
if (Object.isUndefined(Intersport.VKLOHN) || !Intersport.VKLOHN) { Intersport.VKLOHN = {}; }

/**
 */
Intersport.VKLOHN.ExportController = Control.extend(/** @lends Intersport.VKLOHN.ExportController# */{

  /**
   * Export Controller
   * @class Intersport.VKLOHN.ExportController
   * @augments Control
   * @constructs
   */
  init: function(element, options) {
    var that = this;
    this._super(element, options);

    // Members
    this.$toolbar = $('.toolbar');
    this.$form = $('form#ExportForm');
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
    this._super(callback);
    
    // Controls:
    this.exportDataPanel = this.findControl('ExportData'); 

    // Exportieren
    this.$toolbar.find('a.export').click(function(e) {
      $.blockUI(txt.Die_Daten_werden_exportiert);
      that.$form.submit();
      return false;
    });
  },

  /**
   * Wird aufgerufen, wenn der Filter gesetzt werden soll.
   * @param msg Enthält die Antwort vom Server ({type, message}).
   */
  onFormSubmitted: function(msg) {
    $.unblockUI();
    message.show(msg);
    this.exportDataPanel.load();
  }
  

});
