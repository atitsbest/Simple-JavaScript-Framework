/*jslint laxbreak: true*/
/**@namespace Intersport.Controls*/
Base.namespace('Intersport.Controls.Sidebar');

/**
 */
Intersport.Controls.Sidebar.Widget = new Class(/** @lends Intersport.Controls.Sidebar.Widget# */{

  /**@ignore*/
  Extends: Base.Control,
  
  /**@ignore*/
  Implements: Events,

  /**
   * Ein einzelner Eintrag in der Sidebar.
   * @class Intersport.Controls.Sidebar.Widget
   * @extends Base.Control
   * @extends Events
   * @constructs
   */
  initialize: function(element, options) {
    this.parent(element, options);
    
    this.$element = $(element);
    
    // Members:
    this.$head = this.$element.find('.head:first');
    this.$body = this.$element.find('.body:first');
    this.$openedImage = this.$head.find('.opened');
    this.$closedImage = this.$head.find('.closed');
  },
  
  /**
   * Control-Baum ist aufgebaut...
   */
  onReady: function() {
    var that = this;
    
    // Widget �ffnen/schlie�en.
    this.$head.click(function() { that.toggle(); });  

    this.parent();
  },


  /**
   * �ffnen oder schlie�en.
   */
  toggle: function() {
    if (this.isOpen()) {this.close();}
    else {this.open();}
  },  

  /**
   * Widget �ffnen.
   */
  open: function() {
    // Ist bereits offen.
    if (this.isOpen()) {
      return;
    }

    var that = this;
    
    this.fireEvent('beforeOpen');
    // Statusbilder wechseln:
    this.$openedImage.removeClass('hide');
    this.$closedImage.addClass('hide');
    // �ffnen.
    this.$body.slideDown('normal', function() {
      that.fireEvent('finisedOpening');
    });
  },

  /**
   * Widget schlie�en.
   */
  close: function() {
    var that = this;
    
    // Schlie�en.
    this.$body.slideUp(function() {
      // Statusbilder wechseln:
      that.$openedImage.addClass('hide');
      that.$closedImage.removeClass('hide');
    });
  },

  /**
   * Widget ge�ffnet?
   */
  isOpen: function() /**Boolean*/ {
    return this.$body.is(':visible');
  },
  
  /**
   * H�he des gesamten Widgets setzen.
   */
  bodyHeight: function(value) /**Integer*/ {
    if (value) {
      this.$body.height(value);
    }
    else {
      return this.$body.outerHeight();
    }
  },

  /**
   * H�he des Head-Teils.
   */
  headHeight: function() /**Integer*/ {
    return this.$head.outerHeight();
  }

});


