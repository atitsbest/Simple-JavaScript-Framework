/**
 */
var Sidebar = Control.extend(/** @lends Sidebar# */{

  /**
   * Funktionalität für die Sidebar.
   * @class Sidebar
   * @constructs
   */
  init: function(element, options) {
    this._super(element, options);

    // ----------------------------------------
    // Members
    this.$widgetContainer = this.$element.find('.widgets');
    this.widgets = [];
    
    this.$changeMarks = this.$element.find('.changeMark');

    // Publisher
    this.onWidgetOpened = new Publisher();
    this.onWidgetResized = new Publisher();
  },

  /**
   * Controlbaum ist aufgebaut.
   */
  onReady: function () {
    var that = this;

    // Widgets ermitteln.
    this.controls.forEach(function(control) {
      if (control instanceof Sidebar.Widget) {
        that.widgets.push(control);
        // Wenn ein Widget geöffnet wird, dann soll es die ganze
        // Höhe des Widgetcontainers ausnutzen => wir setzten die 
        // neue Höhe bevor das Widget sich öffnet.
        (function() { that._prepareToOpenWidget(control); }).subscribe(control.onBeforeOpen);
        (function() { that.onWidgetOpened.deliver(); }).subscribe(control.onFinisedOpening);
      }
    });
    
    // Register: Sidebar ausblenden.
    this.$element.find('.close').click(function() { that.close(); return false; });
    $('#open_sidebar').click(function() { 
      that.open(); 
      return false;
    });
    
    // Funktionalität zum einblenden der Sidebar NICHT anzeigen.
    if (this.widgets.length == 0) {
      that.$element.find('.open').hide();
    }

    // Publisher subscribe:
    this.onResize.bind(this).subscribe(app.onResize);
    
    this._super();
  },
  
  /**
   * Die Größe des Fensters hat sich geändert.
   */
  onResize: function() {
    var that = this;

    // Höhe des angezeigten Widgets anpassen.
    if (this.isOpened) {
      this.widgets.forEach(function(widget) {
        if (widget.isOpen()) {
          that._resizeWidgetToFullHeight(widget);
        }
      });
      this.onWidgetResized.deliver();
    }
  },
  
  /**
   * Sidebar ausblenden
   */
  close: function(){  
    this.$element.hide();
    app.$main.css('left', '25px');

    $('#open_sidebar').show();
    app.onResize.deliver();
  },
  
  /**
   * Sidebar anzeigen
   */
  open: function() {
    // Bild zum Öffnen der Sidebar aus der DOM entfernen.
    $('#open_sidebar').hide();

    app.$main.css('left', '260px');
      
    // Anzeigen.
    this.$element.show().children().show();

    app.onResize.deliver();
  },
  
  /**
   * Ist die Sidebar geöffnet
   */
  isOpened: function() {
    return this.$element.is(':visible');
  },

  
  // ----------------------------------------------
  // Eine Änderunge in der Sidebar melden.
  registerChange: function (type) {
    this.$changeMarks.show();
  },

  // ----------------------------------------------
  // Stauts der Änderungen zurücksetzten.
  clearChangeStatus: function() {
    this.$changeMarks.hide();
  },

  /**
   * Widget öffnen vorbereiten.
   */
  _prepareToOpenWidget: function(widget) {
    // Offenes Widget schließen.
    this.widgets.forEach(function(widget) { widget.close(); });
    
    // Neue Höhe berechnen.
    this._resizeWidgetToFullHeight(widget);
  },

  /**
   * Widgetgröße an den Widgetcontainer anpassen. 
   */
  _resizeWidgetToFullHeight: function(widget) {
    var height = this.$widgetContainer.innerHeight();
    this.widgets.forEach(function(widget) { height -= widget.headHeight(); });
    widget.bodyHeight(height);
  }
  
});