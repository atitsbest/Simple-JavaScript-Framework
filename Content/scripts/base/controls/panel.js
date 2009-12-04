/**@namespace Base.Controls*/
Base.namespace('Base.Controls');

Base.Controls.Panel = new Class(/** @lends Base.Controls.Panel# */{
  
	/**@ignore*/
	Extends: Base.Control,
	
	/**@ignore*/
	Implements: Events,

  /**
   * Wenn true, kann das Panel verschiedene Seiten der angegeben Url 
   * vom Server laden. Dabei hängt Panel einfach ein 'page=1' an die 
   * Url. Der Server muss dann den richtigen Inhalt zurück liefern.
   * @type Boolean
   */
  pagingEnabled: false,
	
  /**
   * Anzahl der möglichen Seiten.
   * @type Integer
   */
	pageCount: 0,
	
	/**
	 * Die aktuelle Seite (1basierend).
	 * @type Integer
	 */
	currentPage: 1,
	
	/**
	 * Gruppiert Child-Controls und bietet einen besseren Zugriff auf sie d.h.
	 * alle Child-Controls sind direkt über this.&lt;childControlName&gt; ansprechbar.
	 * Mit dem Parameter [url] kann man angeben von wo das HTML für
	 * das Panel asynchron geladen werden soll.
	 * 
	 * @event finishedLoading
	 * @event beforeLoading
	 * @class Base.Controls.Panel
	 * @extends Base.Control
	 * @extends Events
	 * @constructs 
	 */
  initialize: function(element, options) {
  	this.parent(element, options);
    var that = this;

    // Gibt's was zu laden?
    // INFO: Wenn das Panel weiteres HTML laden soll dann schon im CTR
    //       damit beim onReady bereits alle neu geladenen Controls
    //       in der DOM sind und initialisiert werden können.
    if (this.url) {
      // Paging aktiviert? Wenn ja, dann müssen wir erstmal ermitteln, 
      // wieviele Seiten es geben wird.
      if (this.pagingEnabled) {
        var url = $.extend(url, this.url, {params:{getpagecount:true}});
        // Die Anzahl der Seite muss vom Server ermittelt werden.
        $.getJSON(app.buildUrl(url), function(data) {
          that.pageCount = data.result;
          that.load();
        });
      }
      else {
        this.load();
      }
    }
    
  },

  /**
   * Controlbaum ist aufgebaut.
   */
  onReady: function () {
    var that = this;

    // Alle Kindercontrols als Properties bereitstellen.
    this.controls.forEach(function(ctrl) {
       that[ctrl.id] = ctrl;
    });
    
    this.parent();
  },

  /**
   * Fügt den Content von url in {@link Control#$element} ein.
   * @param url=this.url Von hier kommt der Content. Sollte url leer sein wird die url aus den options verwendet.
   */
  load: function(/**string*/url) {
    url = url || this.url;
    
    // Ohne Url kein Daten laden.
    if (!url || url.length == 0) {
    	return;
    }
    
    // Müssen wir blätter?
    if (this.pagingEnabled) {
      // Die Url um die Paging-Infos erweitern.
      url = $.extend(url, {params: {page: this.currentPage}});
    }

		// Benachrichtigen, dass jetzt gleich geladen wird.
		this.fireEvent('beforeLoading');

    // Element mit einer Nachricht blockieren. Die Nachricht (loadMessage) kann 
    // mit den options für das Panel übergeben werden 
    // z.B.: <div class="{ type : 'Panel', loadMessage: 'Bitte warten', ...}">...
    this.$element.block(this.loadMessage);
    
    // Inhalt für das Panel laden.
    $.get(app.buildUrl(url), function(html) {
    	this.$element.html(html);
    	// Controls aufbauen.
      // INFO: Im neu geladenen HTML können Controls sein, die
      //       initialisiert werden wollen.
      var builder = new Base.ControlDOMBuilder(this.$element);
      this.controls = builder.createControls();
      this.onReady();
      this.$element.unblock();
      // Benachrichtigen.
      this.fireEvent('finishedLoading');
    }.bind(this));
  }
});
