/**
 * Hier werden die Abhängigkeiten unter den einzelnen Modulen
 * aufgelöst. 
 */
var dependencies = [

  /* System.jQuery */
  { name: 'system/jquery/jquery-1.3.2', noLint: true },
  { name: 'system/jquery/jquery.blockit' },
  { name: 'system/jquery/jquery.color', noLint: true },
  { name: 'system/jquery/jquery.form', noLint: true },
  { name: 'system/jquery/jquery.dimensions.pack', noLint: true },
  { name: 'system/jquery/jquery.metadata', noLint: true },
  { name: 'system/jquery/jquery.scrollto.min', noLint: true },
	{ name: 'System.jQuery', 
		requires: ['system/jquery/jquery-1.3.2','system/jquery/jquery.blockit','system/jquery/jquery.color',
							 'system/jquery/jquery.form','system/jquery/jquery.dimensions.pack',
							 'system/jquery/jquery.metadata','system/jquery/jquery.scrollto.min'], 
		tagOnly: true },

	/* System.Mootools */
	{ name: 'system/mootools/mootools-1.2.4-core-custom', noLint: true },
	{ name: 'system/mootools/mootools-1.2.4-core', noLint: true },
	{ name: 'system/mootools/mootools-1.2.4.2-more', noLint: true },
	{ name: 'system/mootools/class/mutators/static' },
	{ name: 'System.Mootools', 
		requires: ['system/mootools/mootools-1.2.4-core','system/mootools/mootools-1.2.4.2-more','system/mootools/class/mutators/static'],
		tagOnly: true },

  /* System */
	{ name: 'System', 
		requires: ['System.jQuery','System.Mootools'],
		tagOnly: true },

	/* Base */
	{ name: 'base/namespace' },
	{ name: 'base/mvc' },
	{ name: 'base/control' },
	{ name: 'base/controldombuilder' },
	{ name: 'base/application' },
	{ name: 'Base', 
		requires: ['System','base/namespace','base/mvc','base/control','base/controldombuilder','base/application'],
		tagOnly: true },
	
	/* Base.Controls */
	{ name: 'base/controls/message' },
	{ name: 'base/controls/panel' },
	{ name: 'base/controls/tree' },
	{ name: 'Base.Controls', 
		requires: ['Base','base/controls/panel','base/controls/message'],
		tagOnly: true },

	/* Specs.Framework */
	{ name: 'specs/diff_match_patch', noLint: true},
	{ name: 'specs/jsspec', noLint: true },
	{ name: 'specs/jack', noLint: true }, /* Mocking Framework */
	{ name: 'Specs.Framework',
		requires: ['specs/diff_match_patch','specs/jsspec','specs/jack'],
		tagOnly: true },

	/* Specs */
	{ name: 'specs/base/control_spec'},
	{ name: 'specs/base/controldombuilder_spec'},
	{ name: 'specs/base/namespace_spec'},
	{ name: 'specs/base/controls/panel_spec'},
	{ name: 'Specs',
		requires: ['Specs.Framework',
							 'specs/base/control_spec','specs/base/controldombuilder_spec','specs/base/namespace_spec',
							 'specs/base/controls/panel_spec'],
		tagOnly: true },

  /* Intersport.VKLohn */
  { name: 'intersport/vklohn/application' },
	{ name: 'Intersport.VKLohn', 
		requires: ['Base.Controls','intersport/vklohn/application'], 
		tagOnly: true }
		
];
