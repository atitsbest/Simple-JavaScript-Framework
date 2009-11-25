/**
 * Assertions
 * @class Assert
 */
Assert = function() {}
 

/**
 * Stellt sicher, dass das angegebene Object das angegebene Memeber hat.
 * @throws {String}
 */
Assert.IsAvailable = function(/**Object*/obj, /**String*/name) {
  if (obj == null || typeof(obj) == undefined)
    throw 'Object ist nicht definiert (' + name + ')!';
}