/**
 * @namespace Table.Remote.Paging
 */
if (Object.isUndefined(Table.Remote.Paging) || !Table.Remote.Paging) {
    Table.Remote.Paging = {};
}

/**
 * Dekorator für Filterbare Tabellen.
 */
Table.Remote.Paging.FilterMixin = Table.FilterMixin.extend({
  
  /**
   * CTR
   */
  mixin: function() { // Implements Table.IDataTable, Table.ISortDecorator
    this._super();
    
    var that = this;
    
    this.filterColumnName = "";
    this.filterColumnOptions = {};
    
    // Publisher registrations:
    (function() { that._addFilterParametersToDataTableUrl(); }).subscribe(this.onBeforeLoading);
  },

  /**
   * Filtert die Daten und kümmert sich um die Darstellung in der Tabelle
   */
  filter: function(columnIndex, selectedCategories) {
    this._updateHeaderState(columnIndex);
    this.filterParams = selectedCategories;
    this.filterColumnName = this._getPropertyName(columnIndex);
    this.filterColumnOptions = this._getPropertyOptions(columnIndex);
    this._showFilteredData(columnIndex);
    this.selectedColumn = -1;  
  },

  /**
   * Zeigt wieder alle Zeilen an.
   */
  clearFilter: function() { 
    this._super();
    this.filterParams = [];
    this.filterColumnName = "";
    this.filterColumnOptions = {};
    this.selectedColumn = -1;
    this.clearUrlParameters();
    this.load(); // Tabelle neu laden.
  },

  /** 
   * DataTable Url um die Filterkriterien anreichern.
   */
  _addFilterParametersToDataTableUrl: function() {
    var that = this;
    
    // Wird überhaupt gefiltert.
    if (this.filterColumnName != '') {
      this.addUrlParameter({
        filterColumn: this.filterColumnName,
        // INFO: Die Filterwerte könnten auch mit einem filterParams.toString() an die
        //       Url gehängt werden, doch entsteht dann ein Problem mit Preisen die 
        //       Kommastellen haben, die durch ein Komma getrennt sind. Dieses Komma
        //       wird auch als Trennzeichen beim toString() verwendet => Fehler.
        filterValues: (function() { 
            var result = [];
            $(that.filterParams).each(function(i, val) {;
              result.push(that.filterColumnOptions.number
                ? parseFloat(val)
                : val);
            });
            return result.toString();
          })()
      });
    }  
  },

  /**
   * Ermittelt die Spaltenwerte vom Server
   */
  _getDistinctColumnValuesFromTableAsync: function(columnIndex, callback) {
    var that = this;
    var returnData = {};
    
    $("#main").block({message: ''});
    $("#main").addClass("blockUI");
    
    // Option-Liste holen (remote data)
    $.get(mvc.buildUrl(this.settings.filter.getColumnValuesUrl), {column : this._getPropertyName(columnIndex)}, function(data) {
        var dispo = eval(data);
        
        // Neue nicht-redundante Liste erstellen
        var filterlist = new Array();
         
        for(var j = 0; j < dispo.items.length; j++){
          filterlist[j] = { 
            text: dispo.items[j].trim(),
            // Entweder ist noch kein Filter gesetzt (alle werden angehakt), oder nur bestimmte.
            visible: (that.filterParams.length == 0 || that.filterParams.contains(dispo.items[j])) 
          };
        }
        
        // HashTable mit nicht-redudanten Informationen erstellen
        returnData = {};
        for(var j = 0; j < filterlist.length; j++)
          returnData[filterlist[j].text] = filterlist[j];
          
        $("#main").unblock();
        $("#main").removeClass("blockUI");

        if($.isFunction(callback)) callback(returnData);
      });
  },

  /**
   * Lädt und zeigt die Remote-Daten in der Tabelle, die der Filter-Einstellung entsprechen.
   */
  _showFilteredData: function(index) {
    // Lädt alle gefilterte Daten in die Tabelle.
    if (this.filterParams.length > 0) {
      this.load();
      this._markColumnAsFiltered(index); //...markieren.
    } 
  },
  
  /**
   * Eigenschaftname (entspricht Spaltenindex) holen.
   */
  _getPropertyName: function(index) {
      return this._getPropertyOptions(index).property;  
  },

  /**
   * Eigenschaftoptionen (entspricht Spaltenindex) holen.
   */
  _getPropertyOptions: function(index) {
      var $headerColumns = $('table.data.header').find("thead").children().children();
      return $headerColumns.eq(index).metadata({type:'elem',name:'script',single:'jdata'});  
  },
  
  /**
   * Lädt den ColumnFilter
   * @param dataTable Control der Tabelle
   * @param columnIndex Index der ausgewählten Spalte
   */
  _loadColumnFilter: function(dataTable, columnIndex) {
    if (this.rowCount > app.warningThreshold)
	    if (!confirm(txt.ES_SIND_MEHR_ALS + app.warningThreshold.toString() + txt.MODELLE_VORHANDEN_DIE_GEWUENSCHTE_OPERATION_KOENNTE_DESHALB_LAENGER_DAUERN))
	      return;
  
    var columnFilterControl = app.findControl('filter');
    
    this.clickedHeader = true;
    
    //todo: funktioniert noch nicht richtig & sollte nicht im mixin stehen??
    //Spalte ermitteln.
    var $headerCell = this.$header.find('th').eq(columnIndex);        
    columnFilterControl.alignToElement($headerCell);    
    
    this.selectedColumn = columnIndex;
    columnFilterControl.reloadColumnFilter(dataTable, columnIndex);
    this._handleUI();
  }
  
});