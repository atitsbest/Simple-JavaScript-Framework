/**
 * Erwartet eine Exception. Der Test schlägt fehl, wenn keine Exception
 * geworfen wurde.
 *
 * @example expectException(function() { var x = 10 / 0 });
 * @desc Erwartet eine Division durch Null.
 *
 * @param function action Die Funktion in der die Exception erwartet wird.
 * @param string message Die Nachricht wird bei Erfolg/Fehlschalg angezeigt.
 *
 * @name expectException
 * @author MeiSt
 */
function expectException(action, message) {
  Assert.IsAvailable(action);
  
  try {
    action();
  } 
  catch(e) {
    return ok(e, message);
  }
  ok(false, message);
}