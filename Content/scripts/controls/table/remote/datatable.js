/**
  @namespace Table.Remote
 */
if (Object.isUndefined(Table.Remote) || !Table.Remote) {
    Table.Remote = {};
}

/**
  @class
  Remote-Data-Table
 */
Table.Remote.DataTable = Table.DataTable.extend({

  /**
    CTR
   */
  init: function(table, options) {
    this._super(table, options);
    
    // Wird aufgerufen nachdem das HTML geladen, aber bevor das HTML
    // in die DOM eingefügt wird.
    this.onBeforeInsertingHtml = new Publisher();
  },
  
  /**
   * Controlbaum ist aufgebaut.
   */
  onReady: function() {
    // Tabellendaten laden...aber nur 1x.
    // INFO: Die Tabelle wird hier geladen, damit andere Controls
    //       die sich an den onFinishedLoading Publisher gehängt
    //       haben auch benachrichtigt werden.
    if (!this.noInitialLoad) {
      this.load();
      this.noInitialLoad = true;
      
      // ___________________________________________________
      // Was soll nach dem Entfernen einer Zeile passieren? 
      // (vorerst nur für die Bestellübersicht implementiert)
      var that = this;
      var orderviewController = app.findControl('orderviewcontainer');
      if (orderviewController) {
        (function(callback) {
          //nur falls ein Modelltyp entfernt wurde (Event wird auch bei "alle Sichtbaren entfernen" delivered
          //REFACTOR: schöner lösen... eventuell hier nicht abfragen und das ganze auch bei "alle sichtbaren entfernen" 
          //mit einem Array von Modelltypen zum Nachladen machen?
          //REFACTOR: eigentlich wollte ich hier eine bool-Variable machen, die angibt, ob nur ein Modelltyp entfernt wurde - übergebe
          //ich allerdings diese Variable, so kennt er das callback nicht mehr! *grml*
          if($.isFunction(callback)) {
            //vielleicht gibt es eine Methode, die sich um die Anpassungen bzgl. Paging kümmert
            if($.isFunction(that.adaptPaging))
              that.adaptPaging(callback);
            else
              if($.isFunction(callback)) callback();
          }
        }).subscribe(orderviewController.onModeltypeRemovedFromBasket);
      }
    }    

    this._super();
  },

  /**
    Daten Laden und anzeigen.
   */
  load: function() {
    var that = this;

    this.onBeforeLoading.deliver();
  
    // Url ermitteln.
    if (arguments)
      this.addUrlParameter(arguments[0]);
    var url = this.getUrl();
    
    // "Loading..." anzeigen?
    if (this.settings.remote.indicator_at) {
      $(this.settings.remote.indicator_at).block();
    }
    
    $.get(url, function(data) { 
      // Wenn wir die geladenen Daten in einer eigenen Klassenvariable speichern
      // können auch andere Methoden darauf zugreifen.
      that._data = data;
      // Deliver...
      that.onBeforeInsertingHtml.deliver();
      // Daten einfügen.
      that.$tableBody.html(that._data);
      
      // Controls in den Daten init.
      that._initializeChildControls(); 
      
      if (that.settings.remote.indicator_at) {
        $(that.settings.remote.indicator_at).unblock();
      }
    });
  },
  
  /**
   * Fügt eine Zeile am Ende der bestehenden Tabelle ein
   * @parameter id eindeutige Identifikation, um den Inhalt der Zeile zu ermitteln
   * @parameter callback
   */
  addRow: function(id, callback) {
    var that = this;
    
    this.onBeforeLoading.deliver();
    
    var url = mvc.buildUrl({ action: 'addRow', params: {id: id}});
    
    //HTML ermitteln und an die Tabelle anfügen
    $.get(url, function(data) {
      that.$element.find('tbody').append(data);
      if($.isFunction(callback)) callback(true);
    });
  },

  /**
    Ermittelt die Url zum Laden der Tabelle inkl. aller Urlparameter.
    @param url Optionale Url um die Url aus der Konfiguration zu überschreiben.
   */
  getUrl: function(url) {
  
    // Die Url für den remote Aufruf.      
    var result = url 
      ? url
      : (this.settings.remote.url || '');
    
    // Wurden für die url controller/action angegeben?      
    if (result.action) {
      result = mvc.buildUrl(
        result.controller, 
        result.action, 
        $.extend(result.params, this._urlParameters));
    }
    
    return result;
  },
  
  /**
   */
  _initializeChildControls: function() {
    var that = this;
    
    this.controls = [];
    // Neue Controls aufbauen.
    this.initializeChildControls();
    this.onReady();

    // Deliver.    
    var handle = window.setInterval(function() { 
      if (!Control.loader.sourceFileSetQueue.isRunning) {
        window.clearInterval(handle);
        that.onFinishedLoading.deliver();      
      } 
    }, 100);
  }
  
});
