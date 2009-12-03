if (Object.isUndefined(Intersport) || !Intersport) { var Intersport = {}; }
if (Object.isUndefined(Intersport.VKLOHN) || !Intersport.VKLOHN) { Intersport.VKLOHN = {}; }

/**
 */
Intersport.VKLOHN.ExportConfigurationController = Control.extend(/** @lends Intersport.VKLOHN.ExportConfigurationController# */{
  /**
   * ExportConfiguration Controller
   * @class Intersport.VKLOHN.ExportConfigurationController
   * @augments Control
   * @constructs
   */
  init: function(element, options) {
    var that = this;
    this._super(element, options);

    // Members
    this.$toolbar = $('.toolbar');
    this.$form = $('form');
    this.$form = $('form#ExportConfigurationForm');
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
    this.exportConfigurationDataPanel = this.findControl('ExportConfigurationData');

    // Speichern
    this.$toolbar.find('a.save').click(function(e) {
      $.blockUI(txt.Die_Daten_werden_gespeichert);
      that.$form.submit();
      return false;
    });
  },

  /**
   * Wird aufgerufen, wenn der Speichervorgang fertig ist.
   * @param msg Enthält die Antwort vom Server ({type, message}).
   */
  onFormSubmitted: function(msg) {
    $.unblockUI();
    message.show(msg);
    this.exportConfigurationDataPanel.load();
  }

});
