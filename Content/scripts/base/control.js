Base.Control = new Class(/** @lends Base.Control# */{
	/**
	 * Bietet die Möglichkeit einem DOM-Element ein Verhalten zuzuweisen. 
	 * @class Base.Control
	 * @constructs
	 * @param {String|jQuery|Element} element Das Element für das diese Klasse erstellt wird.
	 * @param settings Einstellungen zu diesem Control. Die Einstellungen werden aus dem Metadaten des Elements gelesen.
	 *
	 * @description
	 * Aus folgendem HTML:
	 * <pre name="code" class="html">
	 *  &lt;div id="test" class="{ type : 'Panel', url: 'http://google.com'}" /&gt;
	 * </pre>
	 * Wird ein Panel erstellt. Der Aufruf würde dabei so aussehen:
	 * <pre name="code" class="js">
	 *  var panel = new Panel('#test', { type : 'Panel', url: 'http://google.com'});
	 * </pre>
	 * Anschließend kann man auf die Metadaten des Elements auch im Control zugreifen:
	 * <pre name="code" class="js">
	 *  panel.type; // => 'Panel'
	 *  panel.url; // => 'http://google.com'
	 *  panel.id; // => 'test'
	 *  panel.$element; // => jQuery Objekt verweist auf &lt;div id="test" ... /&gt; 
	 * </pre>
	 */
	initialize: function(element, /**Hash*/settings) {
		// Default Parameter.
		element = element || document;
		settings = settings || {};
		
		/**
		 * Das DOM-Element für dass dieses Controls erstellt wurde.
		 * @type jQuery
		 */
		this.$element = $(element);
		
		/**
		 * Name des Types.
		 * @type String
		 */
		this.type = settings.type;
		
		if (!settings.dontExtend) {
			$.extend(this, settings);
		}
		
		/**
		 * Die Id des Controls.
		 * Wenn keine Id übergeben wurde, verwenden wir die des Elements.
		 * @type String
		 */
		this.id = settings.id || $(element).attr('id');
		
		/**
		 * Liste der Child Controls.
		 * @type Array.<Control>
		 */
		this.controls = [];
	},
	
	/**
	 * Wird aufgerufen nachdem der Control-Baum erstellt wurde.
	 */
	onReady: function() {
		if (this.controls) {
			this.controls.forEach(function(ctrl) { 
				ctrl.onReady(); 
			});
		}
	},
	
	/**
	 * Sucht ein Control mit der angegebenen Id im Composite.
	 * <p>
	 *  Es werden nur Controls gesucht die Kinder des aufrufenden Controls sind.
	 *  Die Hierarchie ergibt sich meist aus der Hierarchie der Control (this.$element) 
	 *  Elemente in der DOM.
	 * </p>
	 * @param id Id des Controls das gesucht wird.
	 * @returns {Control} null wenn das Controll nicht gefunden wurde.
	 */
	findControl: function(/**String*/id) {
		// Selber?
		if (this.id == id) {
			return this;
		}
		
		// Kinder durchsuchen
		for(var i=0; i<this.controls.length; i+=1) {
			if (this.controls[i].id == id) {
				return this.controls[i];
			}
		}
		// Enkelkinder durchsuchen.
		// INFO: Aus Geschwindigkeitsgründen werden erst alle
		//       Kinder durchsucht und dann die Enkelkinder.
		for(i=0; i<this.controls.length; i+=1) {
			var result = this.controls[i].findControl(id);
			if (result) {
				return result;
			}
		}
		
		// Nicht gefunden.
		return null;
	},
	

	/**
	 * Sucht alle Controlls deren Id auf die Regex passen {@link Control#findControl}.
	 * @param RegEx Pattern, das zu den Ids der Controlls passt.
	 * @returns {Array.<Control>} [] wenn keine Controlls gefunden wurden.
	 */
	findControls: function(/**Regex*/pattern) {
		return this._findControls(pattern, 'id');
	},

	/**
	 * Sucht alle Controlls deren Id auf die Regex passen {@link Control#findControls}.
	 * @param RegEx Pattern, das zu den Typen (z.B.: Table.Remote.DataTable) der Controlls passt.
	 * @returns {Array.<Control>} [] wenn keine Controlls gefunden wurden.
	 */
	findControlsByType: function(pattern) {
		return this._findControls(pattern, 'type');
	},

	/**
	 * Geht alle Controlls im Baum durch und ruft für jedes die 
	 * Callback Funktion auf.
	 * Liefert die Callback Funktion true zurück, wird abgebrochen.
	 * @param callback Wird pro Control aufgerufen.
	 * @param parent Das Control dessen Kinder durchsucht werden.
	 */
	iterateControls: function(/**Function*/callback, /**Control*/parent) {
		parent = parent || this;
		
		if (!parent.controls) {
			return;
		}
		
		for(var i=0; i<parent.controls.length; i+=1) {
			var result = callback(parent.controls[i]);
			if (result === true) {
				return;
			}
			// Rekursion.
			this.iterateControls(callback, parent.controls[i]);
		}
	},

	/**
	 * Liefert die Höhe von this.$element (outerHeight).
	 */
	height: function() /**int*/ {
		return this.$element.outerHeight();
	},
	
	/**
	 * Richtet das Control visuell an Target-$Element aus.
	 */
	alignToElement: function($target) {
		var pos = $target.position();
		var top = ($.browser.msie && $.browser.version > 7) ? 0 : $target.offsetParent().position().top;
		this.$element
			.css('top', pos.top + top + $target.outerHeight())
			.css('left', pos.left/* - $target.innerWidth()*/);
	},  

	/**
	 * Sucht alle Controlls deren Id auf die Regex passen.
	 * @param pattern RegEx der mit member getestet wird.
	 * @param member Member des Controls das überprüft wird.
	 * @returns {Array.<Control>} [] wenn keine Controls gefunden wurden.
	 */
	_findControls: function(/**Regex*/pattern, /**String*/member) {
		var result = [];
		
		// Gehör ich auch dazu?
		if (pattern.test(this[member])) {
			result.push(this);
		}
			
		this.iterateControls(function(control) {
			if (pattern.test(control[member])){
				result.push(control);
			}
		});
		
		return result;
	}

});

/**
 * Liste von Typen mit den Factories, die diese Typen erstellen.
 * <pre name="code" class="js">
 *  [{ type: /{\d\w\.}*DataTable$/, factory: new Table.DataTableFactory() }]
 * </pre>
 */
Base.Control._factories =  [];

/**
 * Neuen Typ mit Factory registrieren.
 * @param typePattern RegEx die auf den Typ eines Controls getestet wird.
 * @param factory Factory (z.B.: {@link Table.DataTableFactory}), die das Control erstellen soll, wenn typePattern passt.
 * @example
 *  Control.registerFactory(/^[\d\w\.]*DataTable$/, new Table.DataTableFactory());
 */
Base.Control.registerFactory = function(/**Regex*/typePattern, /**Object*/factory) {
	Base.Control._factories.push({
		type: typePattern,
		factory: factory
	});
};		
