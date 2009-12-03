describe("Base#namespace", {
	// Läuft nach jedem Test.
	'after_each': function() {
		// Alle weiteren Namespaces wieder löschen.
		delete Level1;
	},
	
	'should create a single namespace': function() {
		Base.namespace('Level1');

		value_of(Level1).should_be({});
	},
	
	'should create a nested namespace': function() {
		Base.namespace('Level1.Level2.Level3');

		value_of(Level1).should_include('Level2');
		value_of(Level1.Level2).should_include('Level3');
		value_of(Level1.Level2.Level3).should_be({});
	},
	
	'should not override an existing namespace': function() {
		Base.namespace('Level1');
		Level1.value = 'Testvalue';
		Base.namespace('Level1.Level2');
		
		value_of(Level1.Level2).should_be({});
		value_of(Level1.value).should_be('Testvalue');
	},
	
	'should return the deepest namespace': function() {
		var result = Base.namespace('Level1.Level2');
		Level1.Level2.value = 'Testvalue';
		
		value_of(result).should_include('value');
	}
});