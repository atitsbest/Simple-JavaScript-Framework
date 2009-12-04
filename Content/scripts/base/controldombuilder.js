Base.ControlDOMBuilder = new Class(/**@lends Base.ControlDOMBuilder#*/{

	/**
	 * Von diesem DOM-Element aus, wird die DOM durchlaufen.
	 * @type jQuery
	 */
	$rootElement: null,
	
	/**
	 * List mit allen Controls die nach dem Aufruf createControls gefunden wurden.
	 * @type Array(Control)
	 */
	controls: [],

	/**
	 * Durläuft die DOM und erstellt Controls zu DOM-Elementen wenn die die CSS-Klasse 'type'
	 * als Metadaten haben. 
	 * <p>
	 *  Wenn das DOM-Element Kinder hat, dann werden die Kinder gesucht, die eine CSS-Klasse
	 *  'type' zugewiesen haben z.B.: &lt;div class="{ type : 'Panel' }" /&gt;. Bei diesen Kindern wird versucht
	 *  aus der CSS-Klasse ein JSON-Objekt zu erstellen. Gelingt das wird der type Wert ausgelesen
	 *  und es wird versucht eine Instanz von diesem Typ zu erstellen. 
	 *  Die Kinder werden dann an den Parent gehängt. Auf diese 
	 *  Weise ensteht ein Control-Baum der dieselbe Hierarchie hat wie die DOM-Elemente.
	 * </p>
	 * @class Base.ControlDOMBuilder
	 * @constructs
	 * @param root=document {String|jQuery|Element} Die Root von der ausgehend die DOM durchlaufen wird.
	 */	
	initialize: function(root) {
		this.$rootElement = $(root || document);
	},
	
	/**
	 * Durchläuft die DOM und erstellt die passenden Controls.
	 * @returns {Control[]} Eine Liste mit allen Controls die auf der gleichen Ebene unter root sind. Die einzelnen Controls können weitere geschachtelte Controls enthalten. 
	 */
	createControls: function() {
		this.controls = [];
		this.initializeChildControls(this.$rootElement);	
		return this.controls;
	},

  /**
   * Parst die DOM nach Controls und init. sie.
   * @param $e=this.$element Ab diesem DOM-Element wird im Baum gesucht.
   */
  initializeChildControls: function(/**jQuery*/$e) {
    var that = this;
    
    // Control-Baum erstellen.
    $e.children().each(function(i, child) {
      var $child = $(child);
      
      if ($child.is('.type')) {
        // Control erstellen...
        var result = that._createControl($child)
        // ...in die Liste einfügen...
        that.controls.push(result);     
        // ...und die eigenen Kinder suchen. 
        // INFO: Dadurch, dass wir das Control erst zur Collection
        //       hinzufügen und danach die Kinder init., können die
        //       Kinder bereits nach den Eltern suchen.
        that.initializeChildControls(result.$element);
      }
      else {
        that.initializeChildControls($child);
      }
    });
  },
  
	  /**
    */
  _createControl: function(e) {
    var $e = $(e);

    // Typ ermitteln.    
    var type = $e.metadata().type;
    if (!type) 
      return;
    //console.log('Init new {type}...'.substitute({type:type}));
          
    // Optionen ermitteln.
    var settings = {};
    $.extend(settings, 
      $e.metadata(), 
      $e.metadata({type:"elem",name:"script",single:"scriptdata"}), 
      {parentControl: this});

    // Dependencies auflösen und Instanz erstellen.
    var entryIndex = Base.Control._factories.indexOf(function(f) { 
      return f.type.test(type); 
    });
    
    // Instanz erstellen.
    var result = (entryIndex != -1) 
      ? Base.Control._factories[entryIndex].factory.create($e, settings)
      : eval('new {t}($e, settings);'.substitute({t: type}));
      
    return result;
  }

});