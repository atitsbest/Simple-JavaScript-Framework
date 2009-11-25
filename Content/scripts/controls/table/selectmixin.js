/**
 * Dekorator für Sortierbare Tabellen
 * @mixin Table.SelectMixin
 */
Table.SelectMixin = Class.extend({

  /**
   * CTR
   */
  mixin: function() {
    var that = this;

    // Elements:
    this.$rows; // Wir bei onFinishedLoading gesetzt.

    // Members:
    this.$lastSelectedRow;

    // Publishers:
    this.onRowSelectionChanged = new Publisher();
    this.onMultipleRowsSelected = new Publisher();

    // Tabelle markieren.
    this.$element.addClass('selectable');

    // Mausklicks auf die Tabellenzeilen registrieren.
    (function() { 
      // Zeilen
      that.$rows = that.$element.find("tbody > tr");
      // Zu Anfang soll die erste Zeile als Referenz zu einem Shift-Klick fungieren.
      that.$lastSelectedRow = that.$rows.filter(':first');
      // Klick registrieren.
      that.$rows.filter(':not(".nodata")').click(function(e) { that.onRowClick($(this), e); });
    }).subscribe(this.onFinishedLoading);
    
    // Damit nicht der Text ausgewählt werden kann.
    this.$element[0].onselectstart = function() { return false; };
  },
  
  /**
   * Eine Zeile wurde angeklickt.
   * @param $row jQuery-Element der angewählten Tabellenzeile.
   * @param e Das jQuery Klick-Event.
   */
  onRowClick: function($row, e) {
    //wurde ein Radio-Button markiert?
    if(!$(e.target).hasClass('ignoreRowClick')) {
      // Shift-Klick?
      if (e.shiftKey) {
        var rows = [];
        // Welche Zeilen befinden sich zwischem dem aktuellen
        // und dem letzten Klick?
        var lastIndex = this.$rows.index(this.$lastSelectedRow[0]);
        var currentIndex = this.$rows.index($row[0]);
        var start = Math.min(lastIndex, currentIndex);
        var end = Math.max(lastIndex, currentIndex);

        if (start == end) {
          // Letzte geklickte Zeile == jetzt geklickte Zeile.
          this.onRowSelectionChanged.deliver($row);
        }
        else {
          // Alle Zeilen ermitteln, die zwischem letzen und aktuellen Klick liegen.
          for(var i=start; i<=end; i+=1) {
            rows.push(this.$rows[i]);
          }
          this.onMultipleRowsSelected.deliver(rows);
        }
      }
      else {
        this.onRowSelectionChanged.deliver($row);
      }
    
      this.$lastSelectedRow = $row;
    }
  },
  
  /**
   * Zeile auswählen.
   */
  selectRow: function($row) {
    if (this.settings.select && this.settings.select.single) {
      // Es darf immer nur eine Ziele ausgewählt sein.
      this.$element.find('tr.selected').removeClass('selected');
    }
    $row.addClass('selected');
  }
  
});