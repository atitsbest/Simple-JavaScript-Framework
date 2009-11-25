/**
  @namespace Sidebar
 */
if (Object.isUndefined(Sidebar) || !Sidebar) {
    var Sidebar = {};
}

/**
 */
Sidebar.Widget = Control.extend(/** @lends Sidebar.Widget# */{

  /**
   * Ein einzelner Eintrag in der Sidebar.
   * @class Sidebar.Widget
   * @constructs
   */
  init: function(element, options) {
    this._super(element, options);
    
    this.$element = $(element);
    
    // Members:
    this.$head = this.$element.find('.head:first');
    this.$body = this.$element.find('.body:first');
    this.$openedImage = this.$head.find('.opened');
    this.$closedImage = this.$head.find('.closed');
    
    // Publishers:
    this.onBeforeOpen = new Publisher();
    this.onIsToggled = new Publisher();
    this.onFinisedOpening = new Publisher();
  },
  
  /**
   * Control-Baum ist aufgebaut...
   */
  onReady: function() {
    var that = this;
    
    // Widget öffnen/schließen.
    this.$head.click(function() { that.toggle(); });  

    this._super();
  },


  /**
   * Öffnen oder schließen.
   */
  toggle: function() {
    this.isOpen()
      ? this.close()
      : this.open();
  },  

  /**
   * Widget öffnen.
   */
  open: function() {
    // Ist bereits offen.
    if (this.isOpen())
      return;

    var that = this;
    
    this.onBeforeOpen.deliver();
    // Statusbilder wechseln:
    this.$openedImage.removeClass('hide');
    this.$closedImage.addClass('hide');
    // Öffnen.
    this.$body.slideDown('normal', function() {
      that.onFinisedOpening.deliver();
    });
  },

  /**
   * Widget schließen.
   */
  close: function() {
    var that = this;
    
    // Schließen.
    this.$body.slideUp(function() {
      // Statusbilder wechseln:
      that.$openedImage.addClass('hide');
      that.$closedImage.removeClass('hide');
    });
  },

  /**
   * Widget geöffnet?
   */
  isOpen: function() /**Boolean*/ {
    return this.$body.is(':visible');
  },
  
  /**
   * Höhe des gesamten Widgets setzen.
   */
  bodyHeight: function(value) /**Integer*/ {
    if (value)
      this.$body.height(value);
    else
      return this.$body.outerHeight();
  },

  /**
   * Höhe des Head-Teils.
   */
  headHeight: function() /**Integer*/ {
    return this.$head.outerHeight();
  }

});


