/**@namespace Intersport.VKLohn.Controllers*/
Base.namespace('Intersport.VKLohn.Controllers');

Intersport.VKLohn.Controllers.ImportController = new Class(/**@lends Intersport.VKLohn.Controllers.ImportController#*/{

  /**@ignore*/
  Extends: Base.Control,

  /**
   * Import Controller
   * @class Intersport.VKLohn.Controllers.ImportController
   * @extends Control
   * @constructs
   */
  initialize: function(element, options) {
    this.parent(element, options);
  },  

  /**
   * Controlbaum ist aufgebaut.
   */
  onReady: function() {
    // Controls
    var sidebar = app.findControl('sidebar');

    // Sidebar öffnen.
    sidebar.open();
    
    this.parent();
  }

});
