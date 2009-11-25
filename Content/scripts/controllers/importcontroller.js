if (Object.isUndefined(Intersport) || !Intersport) {  var Intersport = {}; }
if (Object.isUndefined(Intersport.VKLOHN) || !Intersport.VKLOHN) { Intersport.VKLOHN = {}; }

Intersport.VKLOHN.ImportController = Control.extend(/** @lends Intersport.VKLOHN.ImportController# */{
  /**
   * Import Controller
   * @class Intersport.VKLOHN.ImportController
   * @augments Control
   * @constructs
   */
  init: function(element, options) {
    var that = this;
    this._super(element, options);
  },  

  /**
   * Controlbaum ist aufgebaut.
   * @param callback Wird aufgerufen, wenn onReady fertig ist.
   */
  onReady: function (callback) {
    var that = this;

    // Controls
    var sidebar = app.findControl('sidebar');

    // Sidebar öffnen.
    sidebar.open();
    
    this._super(callback);
  }

});
