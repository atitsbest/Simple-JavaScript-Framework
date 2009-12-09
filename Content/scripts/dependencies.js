/**
 * ACHTUNG: Die Datei wurde automatisch durch rake javascript:dependencies erstellt.
 * 				  Änderungen an den JavaScript Anhängigkeiten an dependencies.json durchführen
 *					und dann mit rake javascript:dependencies diese Datei erstellen.
 */
var dependencies = [
  { name: 'system/jquery/jquery-1.3.2' },
  { name: 'system/jquery/jquery.blockit' },
  { name: 'system/jquery/jquery.color' },
  { name: 'system/jquery/jquery.form' },
  { name: 'system/jquery/jquery.dimensions' },
  { name: 'system/jquery/jquery.metadata' },
  { name: 'system/jquery/jquery.scrollto.min' },
  { name: 'system/mootools/mootools-1.2.4-core-custom' },
  { name: 'system/mootools/mootools-1.2.4-core' },
  { name: 'system/mootools/mootools-1.2.4.2-more' },
  { name: 'system/mootools/class/mutators/static' },
  { name: 'base/namespace' },
  { name: 'base/mvc' },
  { name: 'base/control' },
  { name: 'base/controldombuilder' },
  { name: 'base/application' },
  { name: 'base/controls/message' },
  { name: 'base/controls/panel' },
  { name: 'intersport/vklohn/application' },
	{ name: 'Specs.Framework', 
		requires: [
			'specs/diff_match_patch','specs/jsspec','specs/jack'	
		], 
		tagOnly: true },
	{ name: 'Intersport.VKLohn', 
		requires: [
			'Base.Controls','intersport/vklohn/application'	
		], 
		tagOnly: true },
	{ name: 'System', 
		requires: [
			'System.jQuery','System.Mootools'	
		], 
		tagOnly: true },
	{ name: 'Base.Specs', 
		requires: [
			'Specs.Framework','specs/base/control_spec','specs/base/controldombuilder_spec','specs/base/namespace_spec','specs/base/controls/panel_spec'	
		], 
		tagOnly: true },
	{ name: 'Base', 
		requires: [
			'System','base/namespace','base/mvc','base/control','base/controldombuilder','base/application'	
		], 
		tagOnly: true },
	{ name: 'System.Mootools', 
		requires: [
			'system/mootools/mootools-1.2.4-core-custom','system/mootools/mootools-1.2.4-core','system/mootools/mootools-1.2.4.2-more','system/mootools/class/mutators/static'	
		], 
		tagOnly: true },
	{ name: 'System.jQuery', 
		requires: [
			'system/jquery/jquery-1.3.2','system/jquery/jquery.blockit','system/jquery/jquery.color','system/jquery/jquery.form','system/jquery/jquery.dimensions','system/jquery/jquery.metadata','system/jquery/jquery.blockit','system/jquery/jquery.scrollto.min'	
		], 
		tagOnly: true },
	{ name: 'Base.Controls', 
		requires: [
			'Base','base/controls/message','base/controls/panel'	
		], 
		tagOnly: true }
];