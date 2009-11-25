/**
  @mixin
  Mixin für Filterbare Tabellen (abgeleitet von Sortable).
 */
Table.Remote.FilterMixin = Table.FilterMixin.extend({

  /**
   * CTR
   */
  mixin: function() {
    this._super();
  
    var that = this;
    
    // Controlls
    this.$filter = $('#filter');
    this.$resizeImage = this.$filter.find('img.resize');

    (function() {
      that.filterParams = "";
      that._clearHeaderState();
    }).subscribe(this.onBeforeLoading);

  },

  /**
   * Filtert die Daten und kümmert sich um die Darstellung in der Tabelle
   */
  filter: function(columnIndex, selectedCategories) {
    this._updateHeaderState(columnIndex);
    this._showFilteredData($('table.data.header'), columnIndex, selectedCategories);  
  },

  /**
   * Zeigt wieder alle Zeilen an.
   */
  clearFilter: function() {
    // Alle Zeilen anzeigen.
    this.$element.find("tbody > tr").show();

    this._super();
  },
    
  /**
   * Zeigt die Zeilen in der Liste, die der Filter-Einstellung entsprechen.
   */
  _showFilteredData: function(tableHeader, index, selectedCategories) {
    var $headerColumns = tableHeader.find("thead").children().children();

    // Trim/sanitize string values:
    for(var i=0; i<selectedCategories.length; i+=1) {
      if (typeof selectedCategories[i] == 'string') {
        selectedCategories[i] = selectedCategories[i].trim();
      }
    }

    // Filtern...
    this._filterTableColumnByValuelist(
      index, 
      selectedCategories, 
      $headerColumns.eq(index).hasClass("choose") 
        ? this._getMetaCellFilterValue 
        : this._getRegularCellFilterValue);
  },

  /**
   * Filtert die <table> auf dem übergebene Spaltenindex mit den den übergebenen Werten.
   * @param columnIndex Spaltenindex der zu filtern ist.
   * @param filterValues Array der Werte die angezeigt werden sollen.
   */
  _filterTableColumnByValuelist: function(columnIndex, filterValues, getCellValueFunc) {
    var $header = $('table.data.header');
    
    //console.log(filterValues);
    
    // Daten werden mit Hilfe von ausgewählten Kategorien gefiltert.
    if (filterValues.length > 0) {
      $("#wait").show();

      try {
        var $tablerows = this.$element.find("tbody").children();
        var columnValue = "";
        var $tablerow = null;
        
        for(var rowIndex = 0; rowIndex < $tablerows.length; rowIndex+=1) {
          $tablerow = $tablerows.eq(rowIndex);
          columnValue = getCellValueFunc($tablerow.children().eq(columnIndex));
          filterValues.contains(columnValue) 
            ? $tablerow.show() 
            : $tablerow.hide();
        }
        
        this.selectedColumn = -1;
      } 
      finally {
        $("#wait").hide();
      }
    }
  },
  
  /**
   * Liefert den Wert einer Zelle nach dem gefiltert werden kann.
   * Wenn z.B.: ein Bild als Status angezeigt wird, dann kann nicht nach
   * diesem Bild gefiltert werden. Stattdessen arbeiten wir mit Metadaten.
   */
  _getRegularCellFilterValue: function($td) {
    return $td.text().trim();
  },

  /**
   * Liefert den filterbaren Wert einer Zelle, die einen anderen Wert anzeigt,
   * als den nach dem gefiltert wird.
   */
  _getMetaCellFilterValue: function($td) {
    var data = $td.find('p').metadata();
    return data.value
      ? data.value.trim()
      : '';
  },

  
  /**
   * Ermittelt die redundanten Werte einer Tabellenspalte
   * @columnIndex Index der Tabellenspalte
   */
  _getDistinctColumnValuesFromTableAsync: function(columnIndex, callback) {
    var data = {};
    // Kategorien aus der Tabelle entnehmen (redundanten Daten)            
    var $rows = this.$element.find("tbody").children();
    var contentlist = new Array(); // $rows.length);
    var t = 0;
    for(var i = 0; i < $rows.length; i++){
      var value = $rows.eq(i).children().eq(columnIndex).children("p").text().trim();
      // Leerstring wird nicht mitgelistet.
      if (value != ""){
        contentlist[t] = { 
          text: value.trim(), 
          visible: $rows.eq(i).is(':visible') 
        };
        t++;
      }
    }
    
    //Rückgabeliste erstellen: nicht-redundant und als Hash
    //Key entspricht dem Value (Hashtable wird automatisch redundant)
    for(var j = 0; j < contentlist.length; j++)
      data[contentlist[j].text] = contentlist[j];
    
    if($.isFunction(callback)) {
      callback(data);
    }
    
  },
  
  /**
   * Lädt den ColumnFilter
   * @param dataTable Control der Tabelle
   * @param columnIndex Index der ausgewählten Spalte
   */
  _loadColumnFilter: function(dataTable, columnIndex) {
    var that = this;
    
    
    var columnFilterControl = app.findControl('filter');
    this.clickedHeader = true;
    //todo: funktioniert noch nicht richtig & sollte nicht im mixin stehen??
    //Spalte ermitteln.
    var $headerCell = this.$header.find('th').eq(columnIndex);        
    columnFilterControl.alignToElement($headerCell);
    
    var $tablerows = this.$element.find('tbody > tr');

    // Toggle?
    if (this.selectedColumn == columnIndex && this.$filter.is(':visible')) {
      this.$filter.hide();
    }
    else {
      this.selectedColumn = columnIndex;
      columnFilterControl.reloadColumnFilter(dataTable, columnIndex);
      that._handleUI();
    }
  }  

});