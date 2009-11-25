/**
  @namespace Table.Remote.Paging
 */
if (Object.isUndefined(Table.Remote.Paging) || !Table.Remote.Paging) {
    Table.Remote.Paging = {};
}

/**
  @class
  Dekorator für Sortierbare Tabellen
 */
Table.Remote.Paging.SortMixin = Table.Remote.SortMixin.extend({

  /**
    CTR
   */
  mixin: function() {
    this._super();

    var that = this;
    
    (function() { 
      // Wird momentan überhaupt sortiert?
      if (that.currentColumnIndex() >= 0) {
        // Spaltenname ermitteln
        var propertyName = that.$header.find('th:eq(' + that.currentColumnIndex() + ')').metadata({type:'elem',name:'script'}).property;
        // Url erweitern.
        that.addUrlParameter({
          'sortcolumn': propertyName, 
          'desc': that._descending.toString()});
      }
    }).subscribe(this.onBeforeLoading);
  },

  /**
   */
  sort: function(columnIndex, desc) {
    // Auf- oder Absteigend sortieren?
    this._descending = (desc == true);
    // Nach welcher Spalte wird denn sortiert.
    this.currentColumnIndex(columnIndex);
    
    // Tabelle neu laden.
    this.load();
    
    this.markColumnAsSorted(columnIndex);
    // Die aktuell sortierte Spalte, für "Aufsetzen bei..." setzen.
    $('table.startWith').attr('currentColumnIndex', columnIndex);    
  }

});
