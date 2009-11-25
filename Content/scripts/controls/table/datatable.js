// ==========================================
// Namespace
if (Object.isUndefined(Table) || !Table) {
    var Table = {};
}

/**
  @class
  Abstrakte Klasse von 'IDataTable'
 */
Table.DataTable = Control.extend({
  
  /**
    CTR
   */
  init: function(table, options) {
    // Parameter überprüfen
    Assert.IsAvailable(table, 'table');
    Assert.IsAvailable(options, 'options');

    this._super(table, options);

    // Settings
    this.settings = options;
    this.$table = $(table);
    this.$tableBody = this.settings.remote.insert_into
      ? this.$table.find(this.settings.remote.insert_into)
      : this.$table;
    if (this.settings.header)
      this.$tableHeader = $(this.settings.header);

    // Parameter mit denen die Tabelle-Daten-Url erweitert werden kann (z.B.: Paging)
    this._urlParameters = {};

    // Publishers
    this.onBeforeLoading = new Publisher();
    this.onFinishedLoading = new Publisher();
    
    var that = this;

    // Breite berechnen.
    (function() { if (that.settings.fixedwidth) that._calcAndSetWidth(); }).subscribe(this.onFinishedLoading);
  },
  
  onReady: function() {
    
    this._super();
  },
  
  /**
   */
  load: function() {},

  /**
   */
  addUrlParameter: function(keyValuePair) {
    this._urlParameters = $.extend(this._urlParameters, keyValuePair);
  },
  
  /**
   */
  clearUrlParameters: function() {
    this._urlParameters = {};
  },
 
  /**
   * Tabellendefinition von einer anderen Tabelle übernehmen.
   */
   matchColgroupWithTable: function($table) {
    this.$element.find('colgroup').html($table.find('colgroup').html());
   },
 
  /**
   * Wenn die Tabelle nicht 100% breit ist sondern horizontal scrollen
   * soll, muss die Breite der Tabelle berechnet werden.
   */
  _calcAndSetWidth: function() {
     var width = 0;
     this.$table.find('> colgroup > col').each(function(i, col) { width += parseInt(col.width) });
     this.$table.css('width', width + 'px');
     
     // Headerbreite setzen.
     if (this.$tableHeader)
      this.$tableHeader.css('width', width + 'px');
  }
    
});

