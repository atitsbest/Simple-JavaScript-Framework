// ==========================================
// Namespace
if (Object.isUndefined(Table) || !Table) {
    var Table = {};
}

/**
  @class
  Abstrakte Klasse für FilterMixins
 */
Table.FilterMixin = Class.extend({

  /**
    CTR
   */
  mixin: function() {
    var that = this;
    
    // Settings.
    this.settings.filter = $.extend({
      filterStateCssClass: 'filter_state'
    }, this.settings.filter);
    
    // Members.
    this.$header = null;
    this.selectedColumn = -1;
    this.clickedHeader = false;
    this.filterParams = "";
    
    // Mausklicks & Co im DOM registrieren.
    this.$header = this.settings.sort.headerTable != null 
      ? $(this.settings.sort.headerTable) 
      : this.$table;    
    
    // Klick auf Tabellenheader registrieren
    this.$header.find("thead tr th").each(function(columnIndex, headerCell) {
    
	    var $headerCell = $(headerCell);

      // Damit die Spalten mit der Klasse "nosorting" nicht klickbar ist.
      if ($headerCell.hasClass('nosorting'))
        return;
        
	    // Damit der Benutzer auch weiß, daß er auf den Header klicken kann
	    // zeigen wir für den Header den "Link"-Cursor an.
	    $headerCell.css("cursor", "pointer")

	    // Eventhandler.
	    $headerCell.unbind('click').click(function() { 
	      that._loadColumnFilter(app.findControl('dataTable'), columnIndex);
	    });
    });    
  },
  
  /**
   * Header Zelle als sortiert markieren.
   */
  _markColumnAsFiltered: function(columnIndex) {
    this._clearHeaderState();
    this._updateHeaderState(columnIndex);
  },

  /**
   * Sortierfunktion für die Objekt-Liste. 
   * So kann man die Liste von Objekt nach einer bestimmten Property sortieren.
   */
  _sortByText: function(a, b) {
    var x = a.text.toLowerCase();
    var y = b.text.toLowerCase();
    return ((x < y) ? -1 : ((x > y) ? 1 : 0));
  },
  
  /**
   * Der gefilterten Spalte wird im Header ein Symbol hinzugefügt, allen andern Spalten
   * im Header wird dieses Symbol entfernt.
   */
  _updateHeaderState: function(index) {
    // Status bei allen Spalten entfernen.
    this._clearHeaderState();

    // Status für die aktuelle Spalte setzen
    this.$header.find('thead th').eq(index).find('span:first') // span:first weil auch das Sortierkennzeichen ein span sein kann.
      .append('<span class="' + this.settings.filter.filterStateCssClass + '"></span>'); 
  },
  
  /**
   * Filtersymbol aus dem Header entfernen.
   */
  _clearHeaderState: function() {
    // Status bei allen Spalten entfernen.
    this.$header.find('thead th span.' + this.settings.filter.filterStateCssClass).remove();
  },
  
  _handleUI: function() {
    var that = this;
  
    $('#filter').unbind('click').click(function(e){
      e.stopPropagation();
    });
        
    // Beim Mausklick ausserhalb des Filter-Bereiches: Filter-Container wird dann versteckt, 
    // falls es sich in dem Zeitpunkt des Klickes erscheint.
    // Ausnahme: Mausklick wird ignoriert, wenn die Daten für die Filter gerade geladen 
    //           ist (BlockUI gerade im Einsatz).
    $(document).unbind('click').click(function(){ 
      if (!that.clickedHeader && !$("#main").hasClass("blockUI")) {
        that.noFilterAction();
        $(this).unbind('click');
      }
      that.clickedHeader = false;
    });
  },  
  
  /******************************************************************************************************
   * Methoden, die ein FilterMixin zusätzlich implementieren muss um die Funktionalität für den 
   * ColumnFilter zur Verfügung zu stellen
   ****************************************************************************************************** /
  
  /**
   * keine Durchführung von Aktion
   */
  noFilterAction: function(){
      this.selectedColumn = -1;
  },
    
  /**
   * Zeigt wieder alle Zeilen an.
   */
  clearFilter: function() { 
    this.selectedColumn = -1;
    this._clearHeaderState();
  },
  
  /**
   * Filtert die Daten und kümmert sich um die Darstellung in der Tabelle
   * @param columnIndex Index der ausgewählten Spalte
   * @param selectedCategories die ausgewählten Optionen
   */
  filter: function(columnIndex, selectedCategories) { },
  
  /**
   * Ermittelt die variablen Filteroptionen
   * @param columnIndex der Spaltenindex der Spalte, für die die Werte ermittelt werden sollen
   * @param callback Funktion, die die ermittelten Daten erwartet. Daten in folgendem Format:
   *        key: Wert nach dem später gefiltert wird, value: {Anzeigetext, IstDerWertDerzeitSichtbar}
   */
  getDistinctColumnValuesAsync: function(columnIndex, callback) {

    var $headerColumns = $('table.data.header').find("thead").children().children();
    var $headerColumn = $headerColumns.eq(columnIndex);
        
    if($headerColumn.hasClass("choose")) {
      var allMetaData = {};
      // Fixe Auswahl (Boolean oder Enum-Variablen). Werte aus den den Metadaten der Spalte lesen
      $.extend(allMetaData, $headerColumn.metadata({type:'elem',name:'script',single:'jdata'}), $headerColumn.metadata());     
      
      //in das richtige Format bringen
      var data = {};
      for(var j = 0; j < allMetaData.filter.options.length; j++)
        data[allMetaData.filter.options[j].value.trim()] = allMetaData.filter.options[j];    
        
      if($.isFunction(callback)) { 
        callback(data);    
      }
    } 
    else {
      // Option-Liste holen (aus der Tabelle)
      this._getDistinctColumnValuesFromTableAsync(columnIndex, callback);
    }    
  },

  /**
   * Gibt an, ob derzeit alle Zeile sichtbar sind! D.h. ob ein Filter gesetzt ist!
   * Bestimmt, ob der "Filter aufheben"-Tool angezeigt oder ausgeblenden wird.
   */
  isFiltered: function() {
    //todo: schöner lösen
    //wird das filtericon irgendwo angezeigt?
    return ($('table.data.header').find('span .filter_state').length > 0);    
  }
  
});
