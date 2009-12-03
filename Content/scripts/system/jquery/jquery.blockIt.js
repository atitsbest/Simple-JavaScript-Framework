/**
 * Ersatz für BlockUI.
 * Soll auch mit den neuen Dialogen zusammenarbeiten.
 **/
(function() {

  // Style für den Overlay im JSON-Format
  var overlayStyle = {
    'position': 'absolute',
    'top': '0',
    'bottom': '0',
    'left': '0',
    'right': '0',
    'background': '#fff',
    'opacity': '0.5',
    'filter': 'alpha(opacity=50)',
    'width': '100%',
    'z-index': 1000
  };

  var messageStyle = {
    'position': 'absolute',
    'background': '#dee8f6',
    'border': '1px solid #99bbe8',
    'color': '#15428b',
    'font-size': '17px',
    'font-weight': 'normal',
    'padding': '2em 2em',
    'z-index': 1001
  };

  // Wie oft wurde hintereinander blockiert?
  var blockMessages = [];


  // global $ methods for blocking/unblocking the entire page
  jQuery.blockUI = function(msg) { $(window).block(msg); };
  jQuery.unblockUI = function() { $(window).unblock(); };

  /**
   * Zentriert ein Element optisch auf dem window.
   */
  jQuery.fn.center = function(absolute) {
    return this.each(function() {
      var t = jQuery(this);

      t.css({
        position: absolute ? 'absolute' : 'fixed',
        left: '50%',
        top: '50%'
      }).css({
        marginLeft: '-' + (t.outerWidth() / 2) + 'px',
        marginTop: '-' + (t.outerHeight() / 2) + 'px'
      });

      if (absolute) {
        t.css({
          marginTop: parseInt(t.css('marginTop'), 10) + jQuery(window).scrollTop(),
          marginLeft: parseInt(t.css('marginLeft'), 10) + jQuery(window).scrollLeft()
        });
      }
    });
  };

  /**
   *  Tu es
   **/
  jQuery.fn.block = function(msg) {
    var ostyle = JSONToCSS(overlayStyle);
    var mstyle = JSONToCSS(messageStyle);

    msg = msg || 'Die Ergebnisse werden geladen...';

    // Anzahl der Blocks erhöhen.
    blockMessages.unshift(msg)

    // Nicht mehrmals blocken.
    if (blockMessages.length == 1) {
      $('body').append('<div class="_blockIt_" style="' + ostyle + '"></div><div class="_blockIt_ _message_" style="' + mstyle + '">' + msg + '</div>');
      // Zentrieren und anzeigen.
      $('div._blockIt_._message_').center()
    }
    else {
      // Nachricht ändern.
      $('body').find('div._blockIt_._message_').html(msg).center();
    }
    
    return this;
  };

  /**
   *  UnDo it.
   **/
  jQuery.fn.unblock = function() {
    // Nächste Nachricht anzeigen.
    var msg = blockMessages.pop();

    // Block entfernen.
    if (blockMessages.length == 0) {
      $('body').find('div._blockIt_').remove();
    }
    else {
      // Nachricht ändern.
      $('body').find('div._blockIt_._message_').html(msg).center();
    }
    
    return this;
  };

  /**
   * Hilfsfunktion: Wandelt einen Style vom JSON-Format in
   * CSS-Format um.
   */
  function JSONToCSS(style) {
    var result = "";
    for (var key in style) {
      result += key.toString() + ':' + style[key] + ';';
    }

    return result;
  }

})();