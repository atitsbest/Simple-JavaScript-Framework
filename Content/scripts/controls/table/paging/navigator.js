/**
  @namespace Table.Remote.Paging
 */
if (Object.isUndefined(Table) || !Table) { var Table = {}; }
if (Object.isUndefined(Table.Remote) || !Table.Remote) { Table.Remote = {}; }
if (Object.isUndefined(Table.Remote.Paging) || !Table.Remote.Paging) { Table.Remote.Paging = {}; }

/**
 * @class
 * Paging Navigation für DataTable
 */
Table.Remote.Paging.Navigator = Control.extend({

  /**
   * CTR
   */
  init: function(element, options) {
    this._super(element, options);
    
    // Controls:
    this.navigation = {
      $firstLink: this.$element.find('a.first'),
      $prevLink: this.$element.find('a.prev'),
      $nextLink: this.$element.find('a.next'),
      $lastLink: this.$element.find('a.last')
    };
    this.$currentPageTextBox = this.$element.find('input.currentPage');
    this.$pageCountLabel = this.$element.find('span.pageCount');
    
    // Tablecontainer in der Höhe anpassen, damit die Scrollbar
    // nicht unter dem Paging-Control verschwindet.
    // REFACTOR:
    app.$contentcontainer.css('bottom', this.$element.outerHeight());
  },
  
  /**
   */
  onReady: function() {
    var that = this;

    // Controls
    this.pageableControl = app.findControl(this.pageableControlId);

    // Paging mit Datatable verbinden.
    this._attachToDataTable(this.pageableControlId);
    this.$currentPageTextBox.click(function() { $(this).select(); });
    this.update();
  },

  /**
   * Angezeigten Status aktualisieren.
   */
  update: function() {
    var that = this;
    // Infos:
    this.$currentPageTextBox.val(this.pageableControl.currentPage);
    this.$pageCountLabel.html(this.pageableControl.pageCount);
    
    // Event-Reset:
    for(var id in this.navigation) {
      this.navigation[id].unbind('click');
      this._enableLink(this.navigation[id], false);
    }
    this.$currentPageTextBox.unbind('change');
      
    // Events setzen:
    if (this.pageableControl.pageCount > 1 && this.pageableControl.currentPage < this.pageableControl.pageCount) {
      this.navigation.$nextLink.click(function() { that._loadPage(that.pageableControl.currentPage+1); });
      this.navigation.$lastLink.click(function() { that._loadPage(that.pageableControl.pageCount); })
      this._enableLink(this.navigation.$nextLink, true);
      this._enableLink(this.navigation.$lastLink, true);
    }
    if (this.pageableControl.currentPage > 1) {
      this.navigation.$prevLink.click(function() { that._loadPage(that.pageableControl.currentPage-1); })
      this.navigation.$firstLink.click(function() { that._loadPage(1); })
      this._enableLink(this.navigation.$prevLink, true);
      this._enableLink(this.navigation.$firstLink, true);
    }

    if (this.pageableControl.pageCount > 1) {
      this.$currentPageTextBox.change(function() { 
        if (/^\d{0,3}$/.test(that.$currentPageTextBox.val())) {
          that._loadPage(parseInt(that.$currentPageTextBox.val())); 
        }
        else {
          that.$currentPageTextBox.val(that.pageableControl.currentPage);
        }
      });
    }
    
  },
  
  /**
   * Angegebene Seite im DataTable laden. 
   * @param page (optional) Nummer (nullbasiert) die geladen werden soll. 
   */
  _loadPage: function(page) {
    if (page)
      this.pageableControl.currentPage = page;
    this.pageableControl.load();
  },
  
  /**
   * Verbindet dieses Pagingcontrol mit dem DataTable.
   */
  _attachToDataTable: function() {
    
    // Beim Control registrieren.
    this.update.bind(this).subscribe(this.pageableControl.onFinishedLoading);
  },
  
  /**
   * Link de-/aktivieren-
   */
  _enableLink: function($link, enabled) {
    if (enabled) {
      $link.removeClass('disabled');
      $link
        .find('.enabled').removeClass('hide')
        .end()
        .find('.disabled').addClass('hide');
    }
    else {
      $link.addClass('disabled');
      $link
        .find('.enabled').addClass('hide')
        .end()
        .find('.disabled').removeClass('hide');
    }
  }
  
});
