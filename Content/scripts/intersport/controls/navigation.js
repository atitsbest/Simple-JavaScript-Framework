/*jslint laxbreak: true*/
/**@namespace Intersport.Controls*/
Base.namespace('Intersport.Controls');

Intersport.Controls.Navigation = new Class(/** @lends Intersport.Controls.Navigation# */{
  
  /**@ignore*/
  Extends: Base.Control,
  
  /**@ignore*/
  Implements: Events,

  /**
   * Funktionalität für den Breadcrumb-Navigator.
   * @class Intersport.Controls.Navigation
   * @extends Base.Control
   * @extends Events
   * @constructs
   */
  initialize: function(element, options) {
    this.parent(element, options);

    // Members:
    this.$breadCrumbContainer = this.$element.find('.breadcrumbcontainer');
    this.$breadCrumbList = this.$breadCrumbContainer.find('ul');
    this.$breadCrumbs = this.$breadCrumbList.children();
    this.$scrollAreas = null;
    this.$breadCrumbScrollHandle = 0;
    this.initialState = {};
    this._scrollHandle = 0;
    
    var that = this;
    
    // Klick registrieren.
    this.$breadCrumbs.unbind('click').click(function(e) {
      return that.onClick($(this).metadata().id, $(this).find('a')[0].href);
    });
    
    // Anfangsstatus merken.
    this.$breadCrumbs.each(function(i, element) {
      var $element = $(element);
      var id = $element.metadata().id;
      that.initialState[id] = !$element.is('.disabled');
    });
  },
  
  /**
   * Wenn der Controlbaum aufgebaut wurde.
   */
  onReady: function() {
    var that = this;
    
    this._subscribeToControllers();
    
    this._updateBreadCrumbListWidth();
    
    this._createAndInjectScrollAreas();
    
    // Publisher subscribe:
    app.addEvent('resize', this.onResize.bind(this));
    
    this.parent();
  },
  
  /**
   * Ein Breadcrumb wurde angeklickt.
   * @param breadCrumbId
   * @param targetUrl Url, die bei dem Breadcrumb hinterlegt ist.
   */
  onClick: function(/**String*/breadCrumbId, /**String*/targetUrl) {
    //nur reagieren, wenn der Breadcrumb aktiviert ist
    if(!this.$breadCrumbs.filter('.' + breadCrumbId).hasClass('disabled')) {
      this.fireEvent(breadCrumbId, targetUrl);
      // Falls es für diesen Publisher Subscribers gibt, sollen die sich um die weitere Verlinkung kümmern
//      if(publisher.subscribers.length > 0)
//        return false;          
    }
  },
  
  /**
   * Die Größe hat sich geändert.
   */
   onResize: function() {
    var that = this;
    
    this._updateBreadCrumbListWidth();
    this._updateScrollAreaVisibility();
    // Für den IE7
    if ($.browser.msie) {
      setTimeout(function() { that.$breadCrumbContainer.hide().show(); }, 1);
    }
   },
  
  /**
   * Einen Breadcrumb aktiv setzten (es kann immer nur ein Breadcrumb aktiv sein) d.h.
   * alle anderen Breadcrumbs werden deaktiviert.
   * @param breadCrumbId Id des Breadcrumbs, der aktiviert werden soll.
   */
  activate: function(/**String*/breadCrumbId) {
    // Aktuellen Eintrag inaktiv setzten.
    this.$breadCrumbs
      // Wer ist denn gerade aktiv?
      .filter('.active')
        // Und dann setzen wir ihn auch gleich inaktiv.
        .removeClass('active')
        // Das Pfeil-Bild muss noch geändert werden.
        .find('span.arrow')
          .attr('class', 'navigator_sprite arrow navigator_inactive_inactive_png')
        .end()
      .prev()
        // Das Pfeil-Bild vom Vorgänger muss auch noch geändert werden.
        .find('span.arrow')
          .attr('class', 'navigator_sprite arrow navigator_inactive_inactive_png')
        .end()
      .end();

    // Neuen Eintrag aktiv setzen.
    this.$breadCrumbs
      // Gewünschtes Breadcrumb finden...
      .filter('.' + breadCrumbId)
        // ...und aktiv setzten.
        .addClass('active')
        // Bild zum Nachfolger aktiv setzen.
        .find('span.arrow')
          .attr('class', 'navigator_sprite arrow navigator_active_inactive_png')
        .end()
      .prev()
        .find('span.arrow')
          .attr('class', 'navigator_sprite arrow navigator_inactive_active_png')
        .end()
      .end();
  },
  
  /**
   * Breadcrumb auswählbar machen. 
   * @param breadCrumbId
   */
  enable: function(/**String*/breadCrumbId) {
    // Gewünschtes Breadcrumb finden...
    var breadCrumb = this.$breadCrumbs.filter('.' + breadCrumbId);
    // nur wenn der Status geändert werden darf
    if(!(breadCrumb.is('.immutableDisabled'))) {
      // ...und aktiv setzten.
      breadCrumb.removeClass('disabled');
      this._disableAnchor(this.$breadCrumbs.filter('.' + breadCrumbId).find('a'), false);
    }
  },
  
  /**
   * Breadcrumb nicht mehr auswählbar machen. 
   * @param breadCrumbId
   */
  disable: function(/**String*/breadCrumbId) {
    this.$breadCrumbs
      // Gewünschtes Breadcrumb finden...
      .filter('.' + breadCrumbId)
        // ...und inaktiv setzten.
        .addClass('disabled')
      .end();

    this._disableAnchor(this.$breadCrumbs.filter('.' + breadCrumbId).find('a'), true);
  },
  
  /**
   * Ist der angegebene BreadCrumb aktiv (will heißen: Vom Benutzer ausgwählt)?
   * @param breadCrumbId
   */
  isEnabled: function(/**String*/breadCrumbId) {
    return !this.$breadCrumbs
      // Gewünschtes Breadcrumb finden...
      .filter('.' + breadCrumbId)
        // ...und aktiv?
        .is('.disabled');
  },
  
  /**
   * Setzt den Breadcrumb auf den Start-Status zurück.
   * @param breadCrumbId
   */
  resetToInitialState: function(/**String*/breadCrumbId) {
    if (breadCrumbId in this.initialState) {
      if (this.initialState[breadCrumbId]) {this.enable(breadCrumbId);} 
      else {this.disable(breadCrumbId);}
    }
  },
  
  /**
   * Darf der Benutzer auf die Bestellübersicht wechseln?
   */
  updateOrderviewBreadcrumb: function() {
    var that = this;
    
    $.getJSON(mvc.buildUrl({controller:'orderview',action:'isBasketEmpty'}), function(isEmpty) {
      // Wenn der Warenkorb leer ist, darf der Benutzer nicht auf die
      // Bestellübersicht wechseln.
      if (isEmpty) {that.disable('orderview');}
      else {that.enable('orderview');}
      
      // Wenn sich etwas auf dem Server geändert hat, muss sich
      // auch der init.Status ändern, weil der ja eigentlich
      // den Server-Status wiederspiegelt.
      that.initialState.orderview = !isEmpty;
    });
  },

  /**
   * Darf der Benutzer auf die Bestelldetails wechseln?
   */
  updateOrderdetailsBreadcrumb: function() {
    var that = this;
    
    $.getJSON(mvc.buildUrl({controller:'orderdetails',action:'orderCount'}), function(orderCount) {
      // Wenn der Warenkorb leer ist, darf der Benutzer nicht auf die
      // Bestellübersicht wechseln.
      if (orderCount > 0) {that.enable('orderlist');}
      else {that.disable('orderlist');}
    });
  },

  /**
   * Die Navigation registriert sich bei allen wichtigen Controllern 
   * um über Änderungen im Bilder zu bleiben.
   */
  _subscribeToControllers: function() {
    // Controllers:
    var orderviewController = app.findControl('orderviewcontainer');
    var modellistController = app.findControl('modellists');
    var quantityProposalController = app.findControl('quantityproposals');

    // Modelltypen wurden in den Warenkorb gelegt.
    if (orderviewController) {
      this.updateOrderviewBreadcrumb.bind(this)
        .subscribe(orderviewController.onModeltypeRemovedFromBasket)
        .subscribe(orderviewController.onModeltypeOrdered);
      // Eine Bestellung wurde abgesendet.
      this.updateOrderdetailsBreadcrumb.bind(this)
        .subscribe(orderviewController.onModeltypeOrdered);
    }
    if (modellistController) {
      this.updateOrderviewBreadcrumb.bind(this)
        .subscribe(modellistController.onModeltypeAddedToBasket);
    }
    if (quantityProposalController) {
      this.updateOrderviewBreadcrumb.bind(this)
        .subscribe(quantityProposalController.onModeltypeAddedToBasket);
    }
  },

  /**
   * Berechnet die Breite die alle Breadcrumbs zusammen ergeben und setzt die
   * Breite des BreadcrumbContainer auf diese Breite.
   * Das brauchen wir für's Scrollen der Navigation.
   */
  _updateBreadCrumbListWidth: function() {
    var width = 0;
    
    // Breite aller Breadcrumbs ermitteln.
    this.$breadCrumbs.each(function(i, element) { width += $(element).outerWidth(); });
    // Breadcrumpcontainer auf diese Breite setzen.
    this.$breadCrumbList.width(width);
  },
  
  /**
   * Erstellt die Scrollflächen für die linke und die rechte Seite.
   */
  _createAndInjectScrollAreas: function() {
    var that = this;
    
    this.$element.append('<div class="scrollarea left"></div>');    
    this.$element.append('<div class="scrollarea right"></div>');    

    this.$scrollAreas = this.$element.find('.scrollarea');

    // Events registrieren.    
    this.$scrollAreas.hover(
      function() { that._startBreadCrumbScrolling(this); },
      this._stopBreadCrumbScrolling.bind(this));
      
    this._updateScrollAreaVisibility();
  },

  /**
   * Dürfen die Scrollflächen angezeigt werden?
   */
  _updateScrollAreaVisibility: function() {
    var scrollPosition = this.$breadCrumbContainer.scrollLeft();
    
    // Ganz links?
    if (scrollPosition === 0) {
      this.$scrollAreas.filter('.left').hide();
    }
    else {
      this.$scrollAreas.filter('.left').show();
    }
    
    // Ganz rechts?
    // TODO: Performance optimieren.
    if (scrollPosition + this.$breadCrumbContainer.width() >= this.$breadCrumbList.width()) {
      this.$scrollAreas.filter('.right').hide();
    }
    else {
      this.$scrollAreas.filter('.right').show();
    }
  },
  
  /**
   * Startet das Scrolling der Breadcrumbs. Der Vorgang ist asynchron.
   * @param scrollArea Von welcher Seite wurde das Scrolling gestartet.
   */
  _startBreadCrumbScrolling: function(/**jQuery*/scrollArea) {
    var that = this;
    
    if (!this.breadCrumbScrollHandle) {
      var factor = $(scrollArea).is('.left') ? -1 : 1;

      // Intervall registrieren.
      this.breadCrumbScrollHandle = setInterval(function() {
        var scrollPosition = that.$breadCrumbContainer.scrollLeft();
        that.$breadCrumbContainer.scrollLeft(scrollPosition+(10*factor)).hide().show();
        // UI update.
        that._updateScrollAreaVisibility();
        // Hat sich nichts mehr geändert => am Ende?
        if (scrollPosition == that.$breadCrumbContainer.scrollLeft()) {
          that._stopBreadCrumbScrolling();
        }
      }, 10);
    }
  },
  
  /**
   * Beendet das Scrolling der Breadcrumbs.
   */
  _stopBreadCrumbScrolling: function() {
    if (this.breadCrumbScrollHandle) {
      clearInterval(this.breadCrumbScrollHandle);
      this.breadCrumbScrollHandle = 0;
    }
  },
  
  /**
   * Helper: Einen Link de-/aktivieren.
   * @param $element Der Link also das &lt;a&gt; Element.
   * @param disable Deaktivieren?
   */
  _disableAnchor: function(/**jQuery*/$element, /**Boolean*/disable) {
    if(disable) {
      $element.attr('href_bak', $element.attr("href"));
      $element.removeAttr('href');
    }
    else {
      $element.attr('href', $element.attr('href_bak'));
    }
  }
  
});