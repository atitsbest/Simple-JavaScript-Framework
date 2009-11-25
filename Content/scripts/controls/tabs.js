/**
 */
var Tabs = Control.extend(/** @lends Tabs# */{

  /**
   * Funktionalität für die Tabbar.
   * @class
   * @constructs
   */
  init: function(element, options) {
    this._super(element, options);

    // Members:
    this.$tabs = this.$element.find('.tab');
    this.$container = $(this.container); // Beinhaltet alles Tabseiten. 
    
    // Container Styles setzen.
    this.$container
      .css('overflow', 'scroll')
      .css('position', 'relative'); // IE overflow Bug.    
  },

  /**
   * Controlbaum ist aufgebaut.
   */
  onReady: function () {
    var that = this;

    this.$tabs.click(function() { that.onTabClick(this); });

    this._super();
  },

  /**
   * Wenn auf einen Tab geklickt wird.
   * @param tab HTML-Element auf das geklickt wurde.
   */
  onTabClick: function(tab) {
    // Error string
    var formatInfoMsg = "Für den Tab werden Metadaten im class-Tag im folgenden Format erwartet: class=\"tab : { select: 'anzuzeigenderinhaltquery' }\"";
    // Metadaten holen
    var data = $(tab).metadata();
    
    // Parameter überprüfen
    if (!data || !data.tab || !data.tab.select)
      throw formatInfoMsg;
    data = data.tab;
  
    // Alten Inhalt ausblenden
    this.$container.children().hide();    
    
    // Neuen Inhalt anzeigen
    this.$container.find(data.select).show();
    
    // Alten Tab abwählen
    $(tab).siblings('.tab').removeClass('selected');
    
    // Neuen Tab auswählen
    $(tab).addClass('selected');
  },
  
  /**
   * Liefer den momentan ausgewählten tab-Container zurück.
   */
  selectedContainer: function() /**jQuery*/ {
    // Metadaten des ausgewählten Tabs ermitteln.
    var data = this.$tabs.filter('.selected').metadata();

    // Jetzt können wir aus den Daten den aktuellen Tab.Container ermitteln.
    return this.$container.find(data.tab.select);
  }
});
