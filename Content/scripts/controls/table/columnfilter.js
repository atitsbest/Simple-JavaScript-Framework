// ==========================================
// Namespace
if (Object.isUndefined(Table) || !Table) {
    var Table = {};
}

/**
 * Funktionalität für den Spaltenfilter
 */
Table.ColumnFilter = Control.extend({

  /**
   * CTR
   */
  init: function(element, options) {
    this._super(element, options);
    
    this.dataTable = null;
    this.columnIndex = -1;
    
    // Breite
    this.maxWidth = 400;
    this.minWidth = 170;
    
    // Elements
    this.$searchTextBox = $('#search');
  },
  
  /**
   * Der Controlbaum ist aufgebaut.
   */
  onReady: function () {
    var that = this;
    
    // Actions:
    this.$element.find('a.sort').unbind('click').click(this.onSortClicked.bind(this, false));
    this.$element.find('a.sort.desc').unbind('click').click(this.onSortClicked.bind(this, true));
    this.$element.find('a.cancel').unbind('click').click(this.onClancelClicked.bind(this));
    this.$element.find('#filterClear').unbind('click').click(this.onClearFilterClicked.bind(this));
    this.$element.find('#filtersubmit').unbind('click').click(this.onFilterClicked.bind(this));
    this.$searchTextBox.unbind('keyup').keyup(this._searchTextChange.bind(this));
    this.$element.find('#val_all').unbind('click').click(function() {
      $('ul.values li input[@type="checkbox"]:not("#val_all")').attr('checked', this.checked);                        
    });
        
    this._super();
  },

  /**
   * Sortieren.
   * @param Auf- oder absteigend sortieren.
   */
  onSortClicked: function(desc) {
    if($.isFunction(this.dataTable.sort)) {
      this.dataTable.sort(this.columnIndex, desc);
    }
    else {
      alert('Die Tabelle unterstützt Sortierung nicht!');
    }
    this.close();
    return false;
  },
  
  /**
   * Filter aufheben.
   */
  onClearFilterClicked: function(e) {
    if($.isFunction(this.dataTable.clearFilter)) {
      this.dataTable.clearFilter();
    }
    else { 
      alert('Die Tabelle unterstütz Filtern nicht!');    
    }
    this.close();
  },
  
  /**
   * Filtern.
   */
  onFilterClicked: function(e) {
    if($.isFunction(this.dataTable.filter)) {
      var $categories = $('#filter ul.values li:visible');
      if($categories.length == 2) {
        var boolValue = "";
        for (var i = 0; i < $categories.length; i++) {
          if ($categories.eq(i).children("input:radio").is(':checked')) {
            boolValue = $categories.eq(i).children("input:radio").val();
          }
        }
        selectedCategories = [boolValue];
      } 
      else {
        selectedCategories = this._listSelectedCategories();
      }      
      this.dataTable.filter(this.columnIndex, selectedCategories);
    }
    else {
      alert('Die Tabell unterstützt Filtern nicht!');
    }
    
    this.close();
  },
  
  /**
   * Abbrechen.
   */
  onClancelClicked: function(e) {
    if($.isFunction(this.dataTable.noFilterAction)) {
      this.dataTable.noFilterAction();
    }
    else {
     alert('keine noFilterAction-Function in der Tabelle');
    }
    
    this.close();
  },

  /**
   * Setzt die Daten für den akutellen Aufruf des Spaltenfilters und blendet den das Control ein
   * @param dataTable Control der Tabelle
   * @param columnIndex Index der ausgewählten Spalte
   * @param ist die Tabelle derzeit gefiltert?
   */
  reloadColumnFilter: function(dataTable, columnIndex) {
    var that = this;
  
    this.dataTable = dataTable;
    this.columnIndex = columnIndex;
    
    // Zunächst löschen der alten Option-Liste, falls sie vorhanden ist
    this._removeOptions();
    
    // text in textbox entfernen
    this.$searchTextBox.val("");
    $("#wait").show();
    
    this.showColumnFilter();
    
    //laden der Optionsliste
    if($.isFunction(dataTable.getDistinctColumnValuesAsync)) {
      dataTable.getDistinctColumnValuesAsync(columnIndex, function(data){
        if(data) {
          that._adaptColumnFilterToData(data);
        }
        $("#wait").hide();
      });
    }
  },
  
  /**
   * Blendet den das Control ein
   */
  showColumnFilter: function() {
    this.$element.show();
  },

  /**
    Entfernen von Kategorien für Filter
   */
  _removeOptions: function(){
      // Menu "Filter aufheben" verstecken.
      $('#filterClear').parent().hide();
      
      // Alte Werte von Optionen löschen.
      var $liste = $('#filter ul.values').children();
      $liste.not(":first").remove();
      
      if ($liste.eq(0).children("input:checkbox").is(":checked")){
          $liste.eq(0).children("input:checkbox").removeAttr("checked");
      }
  },
  
  /**
   * Filter schließen.
   */
  close: function() {
    this.$element.hide();
  },
  
  /** -------------------------------------------------------------
   * Methoden aus dem filtermixin (identisch für Remote und Paging)
   * -------------------------------------------------------------- */
  
  /**
   * Beim Eintippen von Texten in dem Search-TextBox muss die Liste von Filter sich dementsprechend verhalten.
   */
  _searchTextChange: function(){
    var $searchtext = this.$searchTextBox.val().toLowerCase();
    var $textlength = $searchtext.length;
    var $flist = $('#filter ul.values').children();
    
    if($flist.length > 1){
        for (var w = 1; w < $flist.length; w++){
            var $cbox = $flist.eq(w).children("input:checkbox");
            if ($textlength > 0){
                var cboxtext = $flist.eq(w).children("label").text().toLowerCase();                
                if (cboxtext.trim().startsWith($searchtext)) {
                    $flist.eq(w).show();
                }
                else{
                    $flist.eq(w).hide();
                }
            }
            else{
                $flist.eq(w).show();
            }
        }
    }    
  },

  /**
   * Die ausgewählten Kategorien werden ermittelt.
   */
  _listSelectedCategories: function(){
      var $categories = $('#filter ul.values li:visible');
      var ind = 0;
      var selectedCategories = new Array();
      
      for(var g = 1; g < $categories.length; g++){
          if ($categories.eq(g).children("input:checkbox").is(':checked')){
              selectedCategories[ind] = $categories.eq(g).children("input:checkbox").val();
              ind++;
          }
      }
      
      return selectedCategories;
  },

  /**
   * ???
   */
  _adaptColumnFilterToData: function(distinctColumnValues) {
    //Anzahl der Einträge ermitteln
    //HACK: erforderlich, weil bei $(distinctColumnValues).length immer 1 geliefert wird... der Zugriff über die 
    //      einzelnen Schlüssel funktioniert aber einwandfrei
    var numberOfEntries = 0;
    for(entry in distinctColumnValues) numberOfEntries++;
    
    if(numberOfEntries < 2) {
      //alles bzgl. filtern ausblenden
      this._setFilterVisible(false);
    }
    else if(numberOfEntries == 2) {
      this._fillFilterOptionBoolean(distinctColumnValues);
    }
    else {
      this._fillFilterOption(distinctColumnValues, numberOfEntries); 
    }
  },

  /**
   * Hier werden die Option-Daten für die Filterung sortiert aufgelistet.
   * Die Liste wird von der entsprechenden ausgewählten Tabellenspalten entnommen.
   */
  _fillFilterOption: function(distinctColumnValues, numberOfEntries) {
    var that = this;
    if (distinctColumnValues) {
      $('li.values').show();
      
      // Checkbox "Alle" sichtbar machen und aktivieren
      that._setCheckboxAllVisible(true);
      $('#val_all').attr('checked', 'checked');
           
      // Die Liste im Browser darstellen
      for (columnKey in distinctColumnValues) {
        columnEntry = distinctColumnValues[columnKey];
        var radioButton = "<li><input type='checkbox' value='{0}' id='{0}' name='choose' {1} /><label for='{0}'>{2}</label></li>".format(
          columnKey, 
          columnEntry.visible ? "checked" : "", 
          columnEntry.text);
      
        $('#filter ul.values').append(radioButton);

        //Checkbox "Alle" deselektieren falls erforderlich
        if(!columnEntry.visible) {
          $('#val_all').removeAttr('checked');
        }
      }
         
      // Filter aufheben ein-/ausblenden
      this._setFilterClearVisible();
      
      //Textbox bekommt einen Fokus (ab 6 Einträgen, weil 7 der Anzahl an maximalen Einträgen entspricht, die durchschnittliche
      //Benutzer 'aufnehmen' können
      if(numberOfEntries > 6) {
        this._enableSearchTextbox();
        this.$searchTextBox.focus();  
      } 
      else {
        this._enableSearchTextbox(false);
      } 
      
      $("#wait").hide();
            
      // Filterbreite an die Breite der Spaltenwerte anpassen.
      that._fitFilterWidth();
      this.$searchTextBox.width(this.$element.find('ul.values').width()-4);
    } 
    else {
      $('li.values').hide();
      this._setFilterClearVisible();
    }
  },

  /**
   * Passt den ColumnFilter für Boolean-Werte bzw. die Auswahl zwischen zwei Werten an
   * @param distinctColumnValues Optionen die angezeigt werden sollen
   */
  _fillFilterOptionBoolean: function(distinctColumnValues) {
    $('li.values').show();
    
    // Checkbox "Alle" ausblenden.
    this._setCheckboxAllVisible(false);

    //Ermitteln, ob alle Sichtbar sind?
    var allVisible = true;
    for (columnEntry in distinctColumnValues)
      if(!distinctColumnValues[columnEntry].visible) allVisible = false;
      
    // Die Liste im Browser darstellen
    for (columnKey in distinctColumnValues) {
      columnEntry = distinctColumnValues[columnKey];
      var radioButton = "<li><input type='radio' value='{0}' id='{0}' name='choose' {1} /><label for='{0}'>{2}</label></li>".format(
        columnKey, 
        columnEntry.visible && !allVisible ? "checked" : "", 
        columnEntry.text);
      
      $('#filter ul.values').append(radioButton);
    }
    
    //Filter aufheben ein/-ausblenden
    this._setFilterClearVisible();    
            
    // Textbox bekommt einen Fokus.
    this._enableSearchTextbox(false);
    $("#wait").hide();
            
    // Filterbreite an die Breite der Spaltenwerte anpassen.
    this._fitFilterWidth();  
  },

  /**
   * Blendet "Filter aufheben" ein/aus
   */
  _setFilterClearVisible: function() {
    if(this.dataTable.isFiltered()) $('#filterClear').parent().show();
    else $('#filterClear').parent().hide();  
  },
  
  /**
   * Steuert die Anzeige der Element zum Filtern
   * @param visible true: Filter-Elemente werden angezeigt, false: Filter-Elemente werden ausgeblendet
   */
  _setFilterVisible: function(visible) {
    if(!visible) {
      //alles Ausblenden
      $('#filter ol  li').hide();
      //Einträge zum sortieren einblenden
      $('#filter ol li.sort').show();
    } else {
      //alles einblenden
      $('#filter ol  li').show();
    }
    //Filter aufheben ein/-ausblenden
    this._setFilterClearVisible();    
  },

  
  /**
   * Filterbreite an die Breite der Filterwerte anpassen.
   */
  _fitFilterWidth: function() {
    var valueMaxWidth = 0;
    this.$element.find('ul.values li label').each(function(i, label) {
      valueMaxWidth = Math.max(valueMaxWidth, $(label).width());
    });
    
    // Filterbreite setzen.
    this.$element.width(Math.min(this.maxWidth, Math.max(this.minWidth, valueMaxWidth + 65)));
  },  
  
  /**
   * Sichtbarkeit der Checkbox "Alle" steuern
   */
  _setCheckboxAllVisible: function(visible) {
    if(visible) $('#filter ul.values').children().eq(0).show();
    else $('#filter ul.values').children().eq(0).hide();
  },
  
  /**
   * Filterbox aktivieren/deaktivieren.
   */
  _enableSearchTextbox: function(deactivate) {
    deactivate
      ? this.$searchTextBox.attr('disabled', 'disabled')
      : this.$searchTextBox.removeAttr('disabled');
  }
  
});