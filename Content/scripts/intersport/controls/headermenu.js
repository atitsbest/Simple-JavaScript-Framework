/**@namespace Intersport.Controls*/
Base.namespace('Intersport.Controls');

Intersport.Controls.Headermenu = new Class(/** @lends Intersport.Controls.Headermenu# */{
  
  /**@ignore*/
  Extends: Base.Control,

  /**
   * Funktionalität für das Headermenü.
   * @class Intersport.Controls.Headermenu
   * @extends Base.Control
   * @constructs
   */
  initialize: function(element, options) {
    this.parent(element, options);
  },  

  /**
   * Der Controlbaum ist aufgebaut.
   */
  onReady: function() {
    $('.popuplink').click(function() {
      var that = this;
      window.open(that.href,
              'title',
              'height=600,width=1000,top=250,left=100,dependent=yes,location=no,menubar=no,resizeable=yes,status=no,toolbar=no');
      return false;
    });

    this.parent();
  }

});