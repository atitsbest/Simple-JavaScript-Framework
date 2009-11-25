/**
  @namespace Table.Remote.Paging
 */
if (Object.isUndefined(Table.Remote.Paging) || !Table.Remote.Paging) {
    Table.Remote.Paging = {};
}

/**
 * Virtual-Paging-Table
 * @mixin Table.Remote.Paging.PagingMixin
 */
Table.Remote.Paging.PagingMixin = Class.extend({
  
  /**
   * CTR
   */
  mixin: function() {
    var that = this;
    // Settings
    this.settings.remote.paging = $.extend({
        frame: null,
        entriesPerChunk: 50,
        scaffoldUrl: { action: 'listscaffold' },
        entryCountUrl: { action: 'listentrycount' }
      }, this.settings.remote.paging);

    // Settings überprüfen.
    Assert.IsAvailable(this.settings.remote.paging.frame, 'frame');
    Assert.IsAvailable(this.settings.remote.paging.scaffoldUrl, 'scaffoldUrl');
    Assert.IsAvailable(this.settings.remote.paging.entryCountUrl, 'entryCountUrl');
    Assert.IsAvailable(this.settings.remote.paging.entriesPerChunk, 'entriesPerChunk');
    
    // Members
    this.$frame = $(this.settings.remote.paging.frame);
    
    // Paging Stati:
    this.rowCount = 0;
    this.currentPage = 1;
    this.pageCount = undefined;
    
    // __________________________________________
    // PreLoad:
    (function() { 
      that._calcPageStati();
      
      that.addUrlParameter({
        start: (Math.max(0, that.currentPage-1)) * that.settings.remote.paging.entriesPerChunk,
        count: that.settings.remote.paging.entriesPerChunk
      });
    }).subscribe(this.onBeforeLoading);

    // __________________________________________
    // PostLoad:
    this.onPostLoad.bind(this)
        .subscribe(this.onBeforeInsertingHtml);  
    
  },
  
  onPostLoad: function() {
    var that = this;
    
    // Anzahl der Einträge ermitteln.
    that.rowCount = parseInt(that._data.substr(0, 6), 10);
    // Zahl vom Markup entfernen.
    that._data = that._data.slice(7);
      
    that._calcPageStati();  
  },
  
  /**
   * Paging zurücksetzen
   */
  resetPaging: function() {
    this.currentPage = 1;
  },
  
  /**
   * Nimmt Anpassungen im Bezug auf das Paging vor ( 
   */
  adaptPaging: function(callback) {
    
    //die Seitenanzahl hat sich eventuell geändert, wenn eine Zeile nachgerutscht ist
    if(this._fetchRowOfNextPage(callback)) {
      //REFACTOR: soll die table wirklich vom dispositionlistTree wissen? gehört eigentlich nicht her... 
      var selectedModelTypeIds = app.findControl('dispositionlistTree').getSelectedModelTypes();
          
      //Werte für das Paging richtig setzen
      this.rowCount = $(selectedModelTypeIds).length;         
          
      //wird nachgeladen ändern sich die Seitenzahlen
      this._calcPageStati();
          
      //updaten des Paging-Navigators
      app.findControl('footer').update();  
    }
  },
  
  
  
  /**
   * Nachladen der Zeile der nächsten Seite falls erforderlich/möglich
   * @parameter params enthält start und count des Pagings 
   * @return true, wenn eine Zeile nachgeladen wurde
   */
  _fetchRowOfNextPage: function(callback) {
    //Welcher Modelltyp soll nachgeladen werden?
    //REFACTOR: soll die table wirklich vom dispositionlistTree wissen? gehört eigentlich nicht her... 
    var selectedModelTypeIds = app.findControl('dispositionlistTree').getSelectedModelTypes();
    
    var count = this.settings.remote.paging.entriesPerChunk;
    var index = count * this.currentPage -1;
    //überprüfen, ob es einen Modelltypen zum Nachladen gibt... und nachladen
    if($(selectedModelTypeIds).length >= index) {
      this.addRow(selectedModelTypeIds[index], callback);
      return true;
    }
    else {
      if($.isFunction(callback)) callback();
      return false;
    }
  },
  
  /**
   * Alles in Sachen Seiten berechnen.
   */
  _calcPageStati: function() {
    // Anzahl der Seiten ermitteln.
    this.pageCount = Math.ceil(this.rowCount / this.settings.remote.paging.entriesPerChunk);
    // Aktuelle Seite setzen, wenn nötig.
    this.currentPage = Math.min(this.pageCount, Math.max(1, this.currentPage));
  }

});