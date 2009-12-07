/*jslint passfail: false, evil: true*/
/**
 */
var Application = Control.extend(/** @lends Application# */{
  /**
   * Die Application
   * @class Application
   * @constructs
   * @param loader Kümmert sich um das (asynchrone) Laden von benötigten .js Dateien {@link dependencies.js}. 
   */
  init: function(/**Object*/loader) {
    // Layout Elemente
    this.$main = $('#main');
    this.$header = $('#header');
    this.$sidebar = $('#sidebar');
    this.$sidebarentries = $('#sidebar > .entries');
    this.$contentcontainer = $('.contentcontainer');
    this.$contentheader = $('.contentheader');
    this.$footer = $('#footer');
    this.$window = $(window);

    // INFO: Controls werden die weiteren JavaScript-Dateien laden
    //       daher setzen wir hier den Loader.
    Control.loader = loader;

    // Alle registriereten DatenTables.
    this._dataTables = [];

    // Publisher
    this.onResize = new Publisher();

    var that = this;

    // IE-Bug: Das Bild (Intersport) von Header wird manches Mal nicht angezeigt.
    //setInterval(function() { that.$header.hide().show(); }, 2000);

    // ------------------------
    // Layout an Fenstergröße anpassen. 
    this.resizeLayout();
    this.resizeContentContainer();
    // Wenn das Fenster die Größe ändert, muss das Layout mitziehen.
    this.$window.resize(function() { that.onResize.deliver(); });
    this.resize.bind(this).subscribe(this.onResize);

    // Header mit dem Body mitscrollen lassen.
    // NICHT ÄNDERN: Code so lassen und nicht mit .attr('onscroll') arbeiten, denn das
    //               funktioniert nicht.
    if (this.$contentcontainer.length > 0) {
      this.$contentcontainer[0].onscroll = function() {
        that.setHeaderScrollPosition(that.$contentcontainer.scrollLeft());
      };
    }
    // ------------------------
    // AJAX-Handling
    this.registerAJAXErrorHandling();
    this.registerAJAXLoadIndicator();
    $.ajaxSetup({ timeout: 10 * 60 * 1000 });

    // Navigator anzeigen.
    $('#headermenu_budget_dropdown').click(function(e) {
      $('#header_menu .dropdown_menu').toggle(); return false;
    });
    // Autom. Focus auf Eingabefelder setzen.
    $('.focus').focus();
    // $('.select').live('click', function() { this.select(); });

    // ------------------------
    // Hilfefenster öffnen.
    $('a.help').click(function() {
      window.open(this.href, this.alt | this.title, 'height:500,width:300,toolbar=no,status=no,menubar=no,location=no');
      return false;
    });

    this._super(null, { id: 'app', noChildInitialize: true });
  },

  /**
   * Die Applikation starten (asynchron).
   */
  run: function() {
    var that = this;

    this.initializeChildControls();
    this.onReady();
  },

  /**
   * Die Fenstergröße hat sich geändert.
   */
  resize: function() {
    this.resizeLayout();
    this.resizeContentContainer();
    if ($.browser.msie) {
      this.$header.hide().show();
    }
  },


  /**  
   * Passt die Größe des .contentcontainer, an die
   * Größe des .contentheaders an.
   */
  resizeContentContainer: function() {
    var headerHeight = 0;
    this.$contentheader.each(function() {
      headerHeight = headerHeight + $(this).height();
    });
    this.$contentcontainer.css('top', headerHeight + 'px');
    this.resizeLayout();
  },

  /**
   * Passt die Größe von Sidebar und Main an die 
   * Fenstergröße an.
   */
  resizeLayout: function() {
    // IE: Nach einem Maximize wird nicht autom. die Scrollposition
    //     des Headers aktualisiert, daher müssen wir das selber
    //     machen.
    //     Wenn man z.B.: in der MVÜ ganz nach rechts scrollt und dann
    //     das Fenster maximiert, scrollt der Header (im IE) nicht zurück.
    if (this.$contentcontainer.length > 0 && this.$contentcontainer[0].onscroll) {
      this.$contentcontainer[0].onscroll();
    }
  },

  /**
   * Setzt die Scrollpos des TabellenHeaders
   */
  setHeaderScrollPosition: function(pos) {
    var $headercontainer = this.$contentheader.find('.headercontainer');
    if ($headercontainer.length > 0) {
      $headercontainer.scrollLeft(pos);
      if ($.browser.msie && $.browser.version <= 7) {
        $headercontainer.hide().show();
      }
    }
  },

  /**
   * AJAX-ErrorHandling
   */
  registerAJAXErrorHandling: function() {
    var that = this;

    $(document)
      .ajaxError(function(event, request, settings) {
        switch (request.status) {
          // UNSICHER: status == 0 => Ajax-Request wurde abgebrochen.  
          case 0:
            break;

          // Session-Timeout: Wir senden ein 403 bei einem Sessiontimeout. Eigentlich würde ein 401 besser passen,  
          //                  doch IE/Safari haben sich entschieden bei einem 401 ein Anmeldefenster zu zeigen, was wir  
          //                  nicht wollen; daher die 403 (Forbidden).  
          case 403:
            $.blockUI();
            var startUrl = mvc.buildUrl('import', 'index');
            alert(txt.Session_abgelaufen);
            window.location = startUrl;
            return;

            // Bei allen anderen Fehlern einfach eine Meldung anzeigen.
          default:
            // Alle blockUIs entfernen.
            $.unblockUI(); $('.blockUI').remove();
            
            // Fehlermeldung anzeigen?
            if (settings.dataType == 'json') {
              var json = eval('('+request.responseText+')');
              message.show(json);
            }
            // Hier haben wir es mit einem ungewünschten Fehler zu tun.
            else {
              $.blockUI(request.responseTest);
            }
            break;
        }

        // Für den Fall, dass es von einer Komponente vergessen wurde.
        $.unblockUI();
      });

    //das hide und show wurde wegen eines IE-Bugs hinzugefügt
    var messageResize = function() {
      that.resizeContentContainer();
      that.$contentheader.hide().show();
    };
    // Oberver
    messageResize.subscribe(message.onShow);
    messageResize.subscribe(message.onHide);
  },

  /**
   * AJAX Work Indikator
   */
  registerAJAXLoadIndicator: function() {
  },

  /**
   * Navigator anzeigen
   */
  showNavigator: function(e) {
    $('select').toggle();
    var $navigator = $('#navigator');
    $('#navigation')
      .css('left', $navigator.position().left + 'px')
      .css('top', ($navigator.position().top + $navigator.outerHeight()) + 'px')
      .toggle();
  },

  /*
   * Änderungen an der Applikation registrieren
   */
  registerChange: function() {
    this.changeMark = true;
  },

  /**
   * Anzeiger der Änderungen wieder löschen.
   */
  clearChange: function() {
    this.changeMark = false;
  },

  /**
   * Hat sich etwas geändert?
   */
  hasChanged: function() /**Boolean*/ {
    return this.changeMark || false;
  }
});