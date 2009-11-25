Message = new Class ({/**@lends Message*/

	/**@ignore*/
	Extends: Control,

	/**@ignore*/
	Implements: Events,
	
	/**
	 * Wird gerade eine persistente Nachricht angezeigt, also eine Nachricht
	 * die zwar überblendet werden kann, aber nach dem Ausblenden der anderen
	 * Nachricht wieder sichtbar wird.
	 * @type Boolean
	 */
	isGlobalFilter: false,
	
	/**
	 * @class Message
	 * @extends Control
	 * @extends Events
	 * @constructs
	 */
	initialize: function(element, options) {
		this.parent(element, options);
	},
	
	/**
	 *
	 */
	onReady: function() {
		this.parent();
	},
	
	/**
	 * Nachricht anzeigen
	 * @param msg Der Text die angezeigt werden soll.
	 * @param type Der Typ der Nachricht z.B.: 'error', 'info', 'succes', ...
	 */
	_showMessage: function(/**String*/msg, /**String*/type, params) {    
    //wo soll die Nachricht angezeigt werden?
    var $viewElement = this.$element;
    if(params && params.viewElement)
      $viewElement = $(params.viewElement);
    
    $viewElement
      .html(msg)
      .attr('class', 'message ' + type)
      .show();
      
    // Alle Subjekte aufrufen.
    this.fireEvent('show');

    if (type == 'info' || type == 'success' || (params && params.timeout)) {
      (function() {
        this.clear();
        // Der Hinweis mit dem GlobalFilter muss erhalten bleiben!
        if (this.isGlobalFilter)
          this.filter(this.isGlobalFilter);
      }).delay(10000, this);
    }
	},
	
	/**
	 * Nachricht ausblenden
	 */
	clear: function(params) {
    //welche Nachricht soll ausgeblendet werden?
    var $viewElement = this.$element;
    if(params && params.viewElement)
      $viewElement = $(params.viewElement);
      
    $viewElement
        .hide();
        
    // Alle Subjekte aufrufen.
    this.fireEvent('deliver');
	},
	
	
	/**
	 * Nachrichten anzeigen
	 * @param msg Der Text.
	 * @param params Optionen
	 * @param params.type Der Type der Nachricht z.B.: 'error', 'info', 'succes', ...
	 */
	show: function(msg, params) {
	  this._showMessage(msg.Message, msg.type.toString().toLocaleLowerCase(), params);
	},
	
	/**
	 * Einen Fehler anzeigen.
	 * @param msg Der Text.
	 */ 
	error: function(msg, params) {
	  this._showMessage(msg, 'error', params);
	},
	
	/**
	 * Eine Information anzeigen. Wird nach 10sec ausgeblendet.
	 * @param msg Der Text.
	 */ 
	info: function(msg) {    
	  this._showMessage(msg, 'info');
	},
	
	/**
	 * Einen Erfolg anzeigen. Wird nach 10sec ausgeblendet.
	 * @param msg Der Text.
	 */ 
	success: function(msg) {    
	  this._showMessage(msg, 'success');
	},
	
	/**
	 * Eine Warnung anzeigen.
	 * @param msg Der Text.
	 */ 
	warning: function(msg) {    
	  this._showMessage(msg, 'warning');
	},
	
	/**
	 * Eine persistente Nachricht anzeigen {@link Message.isGlobalFilter}.
	 * @param msg Der Text.
	 */ 
	filter: function(msg, params) {    
	  this.isGlobalFilter = msg;
	  this._showMessage(msg, 'filter', params);  
	},
	
	autoSaveInfo: function(msg, params){
	  this._showMessage(msg, 'autoSaveInfo');
	}
	
});


