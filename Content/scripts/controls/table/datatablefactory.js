/**
  @namespace Table
 */
if (Object.isUndefined(Table) || !Table) {
    var Table = {};
}

/**
 * Factory zum Erstellen von DataTable in verschiedenen
 * Geschmacksrichtungen.
 * @class Table.DataTableFactory
 */
Table.DataTableFactory = Class.extend({

  /**
   * CTR
   */
  init: function() {
  },

  /**
   * Erstellen einer DataTable.
   */
  create: function(table, settings) {
    Assert.IsAvailable(table, 'table');
    Assert.IsAvailable(settings, 'settings');
    
    // ------------------------
    // Alle was ein IE6 braucht.
    var ie6Fix = function() { 
      if ($.browser.msie && $.browser.version < 7) {
        new Ie6PngFix(); 
      }
    };
    
    var tableHover = function() {
      $('table.hover > tbody > tr').unbind('hover').hover(
        function() { $(this).addClass('hover'); },
        function() { $(this).removeClass('hover'); }
      );
    };
    
    // Tabellen erstellen
    //____________________
    settings = $.extend(settings, { dontExtend: true });
    
    // DataTable erstellen.
    var result = new Table.Remote.DataTable(table, settings);

    // Nach dem Laden...pngs updaten.
    ie6Fix.subscribe(result.onFinishedLoading);
    // ...Hover für Tabellen
    if (!settings.noHover)
      tableHover.subscribe(result.onFinishedLoading);
    // ...Header Scroll wieder zurücksetzen.
    (function() { app.setHeaderScrollPosition(0); }).subscribe(result.onFinishedLoading);

    // Mixins:
    //____________________
    // Jede Tabelle will auswählbar sein.
    if (!settings.noSelect) {
      Class.mixin(result, new Table.SelectMixin());
    }
    if (settings.remote.paging) {
      Class.mixin(result, new Table.Remote.Paging.PagingMixin());
      // Sortieren & Filtern.
      if (settings.filter) {
        //Filterbare Tabellen sind automatisch auch sortierbar
        Class.mixin(result, new Table.Remote.Paging.SortMixin());
        Class.mixin(result, new Table.Remote.Paging.FilterMixin());
      }
      else if (settings.sort)        
        Class.mixin(result, new Table.Remote.Paging.SortMixin());
    }
    else {
      if (settings.filter) {
        //Filterbare Tabellen sind automatisch auch sortierbar
        Class.mixin(result, new Table.Remote.SortMixin());        
        Class.mixin(result, new Table.Remote.FilterMixin());        
      }
      else if (settings.sort)        
        Class.mixin(result, new Table.Remote.SortMixin());
    }

    // Die fertige Tabelle zurückgeben.
    return result;
  }
});

// Factory registrieren...
Control.registerFactory(/^[\d\w\.]*DataTable$/, new Table.DataTableFactory());
