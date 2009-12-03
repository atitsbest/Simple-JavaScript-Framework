/**
 * Hilfsmethoden um besser mit einem Server umzugehen, der im MVC Pattern 
 * realisiert wurde.
 * @class Base.Mvc
 * @author <a href="mailto:meist@infoniqa.com">Stephan Meißner</a>
 */
Base.Mvc = new Class(/** @lends Base.Mvc# */{
	/** 
	 * Extensions der Url.
	 * @example '.aspx' oder '.html' oder ...
	 * @constant
	 */
	actionExtension: '',
	
	/**
	 * Die BasisUrl. Soll im Layout/Masterpage gesetzt werden.
	 */
	baseUrl: '/',
	
	/**
	 * Erstellt eine Url aus Controlle, Action und Parametern.
	 * <p>
	 *  Parameter können als auch Funktionen angegeben werden,
	 *  die jedes mal beim Zusammenstellen der Url ausgewertet werden.
	 *  Auf diese Weise lässt sich im Markup eine Url angeben die
	 *  z.B.: den jeweils ausgewählen Wert eines &lt;select&gt; verwendet.
	 * </p>
	 * @param {string}[controller] Name des Controllers
	 * @param {string}[action] Name der Actions
	 * @param {hash}[parameter] Die Parameter als Hash z.B.: {param1:'value1', param2:17} 
	 * @param {hash}[urlHash] Url als Hash im Format { controller, action, parameter }
	 * 
	 * @example 
	 * buildUrl('controllerName', 'actionName', {id: 10});
	 * // => controllerName/actionName.aspx?id=10
	 *
	 * @example 
	 * buildUrl({
	 *  controller: 'controllerName',
	 *  action: 'actioName',
	 *  params: { id: 10 }
	 * });
	 * // => controllerName/actionName.aspx?id=10
	 *
	 */
	buildUrl: function() /**string*/ {    
	  var args = this.buildUrl.arguments;
	  
	  // Wurde ein Hash übergeben, oder ein string
	  if (args.length == 1) {
	    // Der erste Parameter ist ein Hash mit { controller:, action:, params: }
	    var url = args[0];
	    return this.buildUrl(url.controller, url.action, url.params, url.noCache);
	  }
	  else {
	    var result = "";
	
	    if (args[0])
	      result = this.baseUrl + args[0] + '/';
	    if (args[1])
	      result += args[1] + this.actionExtension;
	    
	    if (args[2]) {
	      if (typeof args[2]  == 'string') {
	        result += args[2];
	      }
	      else {
	        // Aus dem params-Objekt eine string bauen.
	        var counter = 0;
	        for (var param in args[2]) { 
	          result += (counter++ ? '&' : '?') + param + '=';
	          // Ist der Parameter eine Function?
	          result += ($.isFunction(args[2][param]))
	            ? args[2][param]().toString()
	            : args[2][param];
	        }
	      }
	    }
	        
	    // Zufallsgenerierten Parameter der den Browser am chachen hindert (hindern soll ;)
	    if (args[3] == undefined || !args[3])
	      result += (result.lastIndexOf('?') == -1 ? "?" : "&") + "_=" + (String.prototype.rand ? new String().rand(10) : '');
	    
	    return encodeURI(result);  
	  }
	},
	
	/**
	 * Ruft eine Action (synchron) auf und liefert das Ergebnis als JS-Object zurück (JSON)
	 * <p><strong>
	 *  Dieser synchrone Aufruf blockiert den Browser komplett. Darum sollte diese
	 *  Methode nur sehr vorsichtig eingesetzt werden.
	 *  Ihr Vorteil liegt einzig und alleine in einem einfacheren Programmablauf für 
	 *  den Programmierer.
	 * </strong></p>
	 * @param actionName Name der Action (es wird der aktuelle Controller verwendet).
	 * @param params Die Parameter.
	 * @param noinvoke Rückgabewert von HTTP-Request wird nicht als JSON ausgewertet.
	 */
	invokeRemote: function(/**string*/actionName, /**hash*/params, /**bool*/noinvoke) /**object*/ {
	  var url = actionName + this.actionExtension;
	  
	  // Asynchronen Aufruf starten.
	  var result = jQuery.ajax({
	    type: 'GET',
	    url: url,
	    data: params,
	    async: false,
	    cache: false,
	    dataType: 'text'});
	
	  // Fehler?
	  if (result.status != 200)
	    throw new Error(result.responseText);
	  else if (!noinvoke) {
	    // Rückgabewert als JSON  
	    try {
	      return eval('(' + result.responseText + ')');
	    }
	    catch(e) { alert('Beim Verarbeiten des Rückgabewerts von Aufruf ' + url + ' ist folgender Fehler aufgetreten: ' + e); }
	  }
	}

});


