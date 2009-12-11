/**@namespace Intersport.Controls*/
Base.namespace('Intersport.Controls');

/**
 * Funktionalität für den Header.
 * @class Intersport.Controls.Header
 * @extends Base.Control
 */
Intersport.Controls.Header = new Class(/** @lends Intersport.Controls.Header# */{

  /**@ignore*/
  Extends: Base.Control,

  /**
   * Sortiment anzeigen
   */
  setProductline: function(productlineDescription){ 
    var elementToChange = this.$element.find('#headline .productline');
    elementToChange.html(productlineDescription);
  }
  
});
