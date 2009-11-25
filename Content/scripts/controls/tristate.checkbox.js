/**
 * Funktionalität eine Checkbox mit drei Stati.
 * <p>
 *  Weil die Checkbox nur im Tree verwendet wird und der Tree mit vielen
 *  Einträgen arbeiten können muss, kann die Checkbox kein Control sein,
 *  dass verkraftet der Browser nicht.
 *  Daher wird die Funktionalität als Klassenmethoden bereitgestellt. 
 * </p>
 * @class TristateCheckbox
 */
TristateCheckbox = function() {
};

/**
 * Status von einer anderen Checkbox übernehmen.
 * @param $e Das Element einer anderen TristateCheckbox.
 */
TristateCheckbox.applyStateFromCheckbox = function(/**jQuery*/$e) {
  if ($e.is('input')) {
    this.$element.attr('checked', $e.attr('checked'));
  }
  else {
    this.$element
      .removeClass('partly')
      .removeClass('checked')
      .removeClass('unchecked')
      .addClass(TristateCheckbox.getState($e));
  }  
};

/**
 * Abwählen
 * @param $e jQuery-Element der Checkbox. 
 */
TristateCheckbox.uncheck = function(/**jQuery*/$e) {
  if ($e.is('input')) {
    $e.attr('checked', '');
  }
  else {
    $e
      .removeClass('partly')
      .removeClass('checked')
      .addClass('unchecked');
  }
},

/**
 * Auswählen
 * @param $e jQuery-Element der Checkbox.
 */
TristateCheckbox.check = function(/**jQuery*/$e) {
  if ($e.is('input')) {
    $e.attr('checked', 'checked');
  }
  else {
    $e
      .removeClass('unchecked')
      .removeClass('partly')
      .addClass('checked');
  }
},

/**
 * Teilw. auswählen.
 * @param $e jQuery-Element der Checkbox.
 */
TristateCheckbox.checkPartly = function(/**jQuery*/$e) {
  if ($e.is('input')) {
    $e.attr('checked', '');
  }
  else {
    $e
      .removeClass('unchecked')
      .removeClass('checked')
      .addClass('partly');
  }
},

/**
 * Wechselt zwischen checked und unchecked.
 * Bei partly gibt's ein unchecked.
 * @param $e jQuery-Element der Checkbox.
 */
TristateCheckbox.toggle = function(/**jQuery*/$e) {
  if ($e.is('input')) {
//    if ($e.attr('checked') == true)
//      $e.attr('checked', '');
//    else
//      $e.attr('checked', 'checked');
  }
  else {
    if ($e.is('.checked')) {
      this.uncheck($e);
    }
    else {
      this.check($e);
    }
  }
},

/**
 * Ermittelt den aktuellen Status.
 * @param $e jQuery-Element der Checkbox.
 * @returns {String} Mögliche Werte: 'checked', 'unchcecked', 'partly'.
 */
TristateCheckbox.getState = function(/**jQuery*/$e) {
  if ($e.is('input')) {
    return $e.attr('checked') == true 
      ? 'checked'
      : 'unchecked';
  }
  else {
    if (this.isChecked($e))
      return 'checked';

    else if ($e.hasClass('unchecked'))
      return 'unchecked';

    else if ($e.hasClass('partly'))
      return 'partly';
  }
},

/**
 * Aktuellen Status setzen. Ungültige Statuswerte werden ignoriert.
 * @param $e jQuery-Element der Checkbox.
 * @param state Status der Checkbox als String ('checked', 'unchecked', 'partly').
 */
TristateCheckbox.setState = function(/**jQuery*/$e, /**String*/state) {
  if (state == 'checked')
    this.check($e);
  if (state == 'unchecked')
    this.uncheck($e);
  if (state == 'partly')
    this.checkPartly($e);
},

/**
 * Ausgewählt (Status == 'checked')?
 * @param $e jQuery-Element der Checkbox. 
 */
TristateCheckbox.isChecked = function(/**jQuery*/$e) /**Boolean*/ {
  if ($e.is('input')) {
    return $e.attr('checked') == true;
  }
  else {
    return $e.hasClass('checked');
  }
};

