/**
 * @mixin
 * Dekorator für Sortierbare Tabellen
 */
Table.Remote.SortMixin = Class.extend({

  /**
   * CTR
   */
  mixin: function() {
    var that = this;

    // Settings
    $.extend(this.settings.sort, {
      alternateRows: false,
      headerTable: null,
      attachedTable: null,
      onColumnSorting: null,
      sortStateCssClass: 'sort_state',
      innerTag: 'p',
      rowSpan: 1 
    });
    
    // Members
    this._descending = true;
	  this._sortResultValues = null;  // Speichert das Sortierergebnis für eine ev. angehängte Tabelle.
	  this._currentColumnIndex = -1;
    this.$header = null;
    
    this.$header = this.settings.sort.headerTable != null ? $(this.settings.sort.headerTable) : $(this);

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
	      that.sort(columnIndex, !that._descending); // Sortieren...
	      that.markColumnAsSorted(columnIndex, that._descending); //...markieren.
	    });
    });

    // Standard-Sortierung
    if (this.settings.sort.defaultSortedColumn) {
      this.markColumnAsSorted(this.settings.sort.defaultSortedColumn, true);
      this.currentColumnIndex(this.settings.sort.defaultSortedColumn);
    }
  },

  /**
   * Sortiert die Tabelle, markiert die entsprechende Spalte als sortiert, ...
   * @param columnIndex Nach welcher Spalte soll sortiert werden.
   * @param desc Auf- oder absteigend sortieren.
   */
  sort: function(columnIndex, desc) {
    this._sortResultValues = [];
    
    // Nach dieser Spalte wird sortiert.
	  this.currentColumnIndex(columnIndex);
    // Auf- oder Absteigend sortieren?
    this._descending = (desc == true);
    
    // Sortieren.
    this._sortTableContent(columnIndex, 
                           this.$element, 
                           '_sortByColumnFunc');
    // 'Angehängte' Tabelle auch sortieren.
    if (this.settings.sort.attachedTable != null) {
      this._sortTableContent(columnIndex, 
                             $(this.settings.sort.attachedTable), 
                             '_sortByResultFunc');
    }
    
    this.markColumnAsSorted(columnIndex);
  },
    
  /**
   * Eine Spalte optisch als sortiert makrieren.
   * @param columnIndex Nach welcher Spalte soll sortiert werden.
   * @param desc Auf- oder absteigend sortieren.
   */
  markColumnAsSorted: function(columnIndex, desc) {
    // Splate ermitteln.
    var $headerCell = this.$header.find('th').eq(columnIndex);
    
    // Wenn kein Wert für die Sortierart angegeben wurde, wird der aktuelle Wert verwendet.
    if (desc == null || Object.isUndefined(desc))
      desc = this._descending;
    
    // Da immer nur nach EINER Spalte sortiert werden kann,
    // muß die aktuelle Sortierspalte ihren Sortierstatus verlieren und...
    this.$header
      .find("thead tr th.sorted")
        .find('span.' + this.settings.sort.sortStateCssClass)
          .remove() // Statusbild für die Sortierung bei allen Spalten entfernen.
        .end()
        .not($headerCell)
	        .removeClass("sorted")
	        .removeClass("desc"); // Auch der auf-/absteigend Status wird gelöscht.

    // ...die aktuelle Spalte wird als sortiert markiert.
    $headerCell.addClass("sorted");
    // Das Sortier-Status-Bild wird in die DOM eingefügt.
    $headerCell.find('span:first').append('<span class="' + this.settings.sort.sortStateCssClass + '"></span>');
    // Auf-/absteigend.
    if (desc == true)
      $headerCell.addClass("desc");
    else if (desc == false)
      $headerCell.removeClass("desc");
    else
      $headerCell.toggleClass("desc");
  	
    this._descending = $headerCell.hasClass("desc");
  },

  /**
   * Getter/Setter für den Index der Spalte nach der momentan sortiert wird.
   * @param columnIndex Index der Spalte.
   */
  currentColumnIndex: function(columnIndex) {
    // Getter, Setter??
    return Object.isUndefined(columnIndex)
     ? this._currentColumnIndex
     : this._currentColumnIndex = columnIndex;
  },
    
  /**
   * Tabelle sortieren.
   * @param columnIndex Spaltenindex nach dem die Tabelle sortiert werden soll
   * @param $table jQuery-Element der Tabelle die sortiert werden soll.
   * @param sortFunc Funktion die den Wert zweier Zellen vergleicht.
   */
  _sortTableContent: function(columnIndex, $table, sortFunc) {
	  var that = this;
  	
	  // Die Zeilen aus dem Body werden in ein Array kopiert...
	  var rows = [];
	  $.each($table[0].tBodies[0].rows, function(i, row) { rows.push(row);	});
  	
	  // ...das wir dann sortieren können.
	  rows.sort(function(row1,row2) { 
	    var a = that._getTableCellValue(row1, columnIndex);
	    var b = that._getTableCellValue(row2, columnIndex);
	    return that[sortFunc](a, b); 
	  }); 
  	
  	// Zebrastreifen nachziehen und 
  	// die sortieren Zeilen in den Tabellen-Body einfügen.
	  for(var i=0; i<rows.length; i+=1) {
	    (i%2==0)
	      ? $(rows[i]).addClass('odd')
	      :$(rows[i]).removeClass('odd');
		  $table[0].tBodies[0].appendChild(rows[i]);
		}
  },
  	
  /**
   * Die Sortierfuntion die Array.sort übergeben wird..
   * @param row1
   * @param row2 
   */
  _sortByColumnFunc: function(a, b)	{
  	//console.log('{0} <=> {1} => {2}'.format(a,b,result));
	  // Rückgabewerte: 	 0...gleich
	  //					        -1...b unter a
	  //					         1...a unter b
	  var result = (a==b)?0:(a>b)?1:-1;

	  // Rückgabewert...
	  result = this._descending ? (result*-1) : result;
  	
  	// Rückgabewert speichern (für das Sortieren der angehängten Tabelle)
	  this._sortResultValues.push(result)
  		
  		
	  // Auf/-absteigend?
	  return result;
  },
  	
  /**
   * Die Sortierfuntion die Array.sort übergeben wird um eine
   * identische Sortierung wie bei einer vorhergegangenen Sortierung
   * durchzuführen. Wird für das Sortieren der angehängten Tabelle benötigt.
   */
  _sortByResultFunc: function()	{
    return this._sortResultValues.shift();
  },

  /**
   * Ermittelt den Wert einer Tabellenzelle, nach
   * dem dann sortiert werden soll.
   * Als erstes wird dabei das erste Element mit der
   * Klasse "value" berücksichtigt. Sollte es keines geben
   * wird einfach der komplette HTML-Inhalt der Zelle
   * als Wert verwendet.
   */
  _getTableCellValue: function(row, currentColumnIndex)	{
    var result;
	  // Wir holen uns die gewünschte Tabellenzelle...
	  //
	  var $cell = $(row).find("td:nth(" + currentColumnIndex + ")");
    var metadata = $cell.metadata();
	  if (this.settings.sort.innerTag) {
	    $cell = $cell.find(this.settings.sort.innerTag);
	  }

    // Weicht die Anzeige vom wirklichen Wert ab?
    if (!Object.isUndefined(metadata) && !Object.isUndefined(metadata.value)) {
      result = metadata.value;
    }
    else {
      result = $cell.html();
    }
    
    // Auf den richtigen Typen convertieren.
    //console.log(result);
    var maybeANumber = result.replace(/,/, '.');
    if (!isNaN(Number(maybeANumber))) {
      result = Number(maybeANumber);
    }
    //console.log('{0} ({1})'.format(result, typeof result));
    return result;
  }

});