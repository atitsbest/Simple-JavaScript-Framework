/**@namespace Intersport.VKLohn.Controls*/
Base.namespace('Intersport.VKLohn.Controls');

Intersport.VKLohn.Controls.ImportFilter = new Class(/**@lends Intersport.VKLohn.Controls.ImportFilter# */{

  /**@ignore*/
  Extends: Base.Control,

  /**
   * Der Importfilter.
   * @class Intersport.VKLohn.Controls
   * @extends Base.Control
   */
  initialize: function(element, options) {
    this.parent(element, options);

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

    this.parent();
  },

  /**
   * Wird aufgerufen, wenn der Filter gesetzt werden soll.
   * @param msg Enthält die Antwort vom Server ({type, message}).
   */
  onFormSubmitted: function(msg) {
    this.reloadDependencies();
    app.message.show(msg);
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

        app.message.show(msg);
      }
    });
  },

  /**
   * Kümmert sich um alles, was von dem Filter abhängt und eventuell neu geladen werden soll
   */
  reloadDependencies: function() {
    //eventuell das Panel der importierten Daten neu laden
    var $dataToReload = app.findControl('ImportData');
    if ($dataToReload) {$dataToReload.load();}
  }

});