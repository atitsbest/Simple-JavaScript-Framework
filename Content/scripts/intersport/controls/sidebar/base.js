/**@namespace Intersport.Controls*/
Base.namespace('Intersport.Controls.Sidebar');

Intersport.Controls.Sidebar.Base = new Class(/** @lends Intersport.Controls.Sidebar.Base# */{

  /**@ignore*/
  Extends: Base.Control,
  
  /**@ignore*/
  Implements: Events,

  /**
   * Funktionalität für die Sidebar.
   * @class Intersport.Controls.Sidebar.Base
   * @extends Base.Control
   * @extends Events
   * @constructs
   */
  initialize: function(element, options) {
    this.parent(element, options);

    // ----------------------------------------
    // Members
    this.$widgetContainer = this.$element.find('.widgets');
    this.widgets = [];
    
    this.$changeMarks = this.$element.find('.changeMark');
  },

  /**
   * Controlbaum ist aufgebaut.
   */
  onReady: function () {
    var that = this;

    // Widgets ermitteln.
    this.controls.forEach(function(control) {
      if (control instanceof Intersport.Controls.Sidebar.Widget) {
        that.widgets.push(control);
        // Wenn ein Widget geöffnet wird, dann soll es die ganze
        // Höhe des Widgetcontainers ausnutzen => wir setzten die 
        // neue Höhe bevor das Widget sich öffnet.
        control.addEvent('beforeOpen', that._prepareToOpenWidget(control).bind(that));
        control.addEvent('finisedOpening', that.fireEvent('widgetOpened'));
      }
    });
    
    // Register: Sidebar ausblenden.
    this.$element.find('.close').click(function() { that.close(); return false; });
    $('#open_sidebar').click(function() { that.open(); return false; });
    
    // Funktionalität zum einblenden der Sidebar NICHT anzeigen.
    if (this.widgets.length === 0) {
      that.$element.find('.open').hide();
    }

    // Wir müssen wissen, wenn sich die Größe des Fensters geändert hat.
    app.addEvent('resize', this.onResize.bind(this));
    
    this.parent();
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
      this.fireEvent('widgetResized');
    }
  },
  
  /**
   * Sidebar ausblenden
   */
  close: function(){  
    this.$element.hide();
    app.$main.css('left', '25px');

    $('#open_sidebar').show();
    app.fireEvent('resize');
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

    app.fireEvent('resize');
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