/**
 * Hier werden die Abhängigkeiten unter den einzelnen Modulen
 * aufgelöst. 
 */
var dependencies = [

  /* System.jQuery */
  { name: 'system/jquery/jquery-1.3.2' },
  { name: 'system/jquery/jquery.blockit' },
  { name: 'system/jquery/jquery.color' },
  { name: 'system/jquery/jquery.form' },
  { name: 'system/jquery/jquery.dimensions.pack' },
  { name: 'system/jquery/jquery.metadata' },
  { name: 'system/jquery/jquery.scrollto.min' },
	{ name: 'System.jQuery', 
		requires: ['system/jquery/jquery-1.3.2','system/jquery/jquery.blockit','system/jquery/jquery.color',
							 'system/jquery/jquery.form','system/jquery/jquery.dimensions.pack',
							 'system/jquery/jquery.metadata','system/jquery/jquery.scrollto.min'], 
		tagOnly: true },

	/* System.Mootools */
	{ name: 'system/mootools/mootools-1.2.4-core-custom' },
	{ name: 'system/mootools/mootools-1.2.4-core' },
	{ name: 'system/mootools/mootools-1.2.4.2-more' },
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
	{ name: 'specs/diff_match_patch'},
	{ name: 'specs/jsspec' },
	{ name: 'specs/jack' }, 			/* Mocking Framework */
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
		tagOnly: true },


  /* ___________________________
     CONTROLS                    */
      
  /* Table.ColumnFilter */
  { name: 'controls/table/columnfilter' },
  { name: 'Table.ColumnFilter',
    requires: ['app', 'controls/table/columnfilter'],
    tagOnly: true },
  
  /* Table.DataTable */
	{ name: 'controls/table/datatable' },
	{ name: 'controls/table/selectmixin' },
	{ name: 'controls/table/filtermixin' },
	{ name: 'controls/table/datatablefactory' },
	{ name: 'Table.DataTable', 
		requires: ['app','controls/table/datatable','controls/table/selectmixin','controls/table/datatablefactory',
		           'controls/table/filtermixin', 'Table.ColumnFilter'], 
		tagOnly: true },


  /* Table.Remote.DataTable */
	{ name: 'controls/table/remote/datatable' },
	{ name: 'controls/table/paging/pagingmixin' },
	{ name: 'controls/table/remote/sortmixin' },  
	{ name: 'controls/table/paging/sortmixin' },
	{ name: 'controls/table/remote/filtermixin' },
	{ name: 'controls/table/paging/filtermixin' },
	{ name: 'Table.Remote.DataTable', 
		requires: ['Table.DataTable','controls/table/remote/datatable','controls/table/paging/pagingmixin',
		           'controls/table/remote/sortmixin','controls/table/remote/filtermixin',
		           'controls/table/paging/sortmixin','controls/table/paging/filtermixin'], 
		tagOnly: true },

	/* Table.Remote.Paging.Navigator */
	{ name: 'controls/table/paging/navigator' },
  { name: 'Table.Remote.Paging.Navigator',
		requires: ['app','controls/table/paging/navigator'],
		tagOnly: true },
		
  /* Navigation */
  { name: 'controls/navigation' },
  { name: 'Navigation', 
    requires: ['app','controls/navigation'],
    tagOnly: true },
    
  /* Sidebar */
  { name: 'controls/sidebar' },
  { name: 'Sidebar',
    requires: ['app', 'controls/sidebar'],
    tagOnly: true },
    
  /* Sidebar.Widget */  
  { name: 'controls/sidebar.widget' },
  { name: 'Sidebar.Widget',
    requires: ['app', 'controls/sidebar.widget'],
    tagOnly: true },

  /* Sidebar.GlobalFilter */
	{ name: 'controls/sidebar.globalfilter' },
  { name: 'Sidebar.GlobalFilter',
		requires: ['app','controls/sidebar.widget','controls/sidebar.globalfilter'],
		tagOnly: true },

  /* Header */
  { name: 'controls/header' },
  { name: 'Header',
    requires: ['app', 'controls/header'],
    tagOnly: true },
        
  /* Headermenu */
  { name: 'controls/headermenu' },
  { name: 'Headermenu',
      requires: ['app', 'controls/headermenu'],
      tagOnly: true },

  /* Tabs */
  { name: 'controls/tabs' },
  { name: 'Tabs',
      requires: ['app', 'controls/tabs'],
      tagOnly: true },

  /* Tree */
  { name: 'controls/tree' },
  { name: 'controls/tristate.checkbox' },
  { name: 'Tree',
      requires: ['app', 'controls/tree', 'controls/tristate.checkbox'],
      tagOnly: true },


  /* Intersport.VKLOHN.ImportFilter */
  { name: 'controls/Intersport.VKLOHN/importfilter' },
  { name: 'Intersport.VKLOHN.ImportFilter',
      requires: ['app', 'controls/Intersport.VKLOHN/importfilter'],
      tagOnly: true
  },
  
  
  /* ___________________________
     CONTROLLERS                 */

  /* Export */
  {name: 'controllers/exportcontroller' },
  { name: 'Intersport.VKLOHN.ExportController',
    requires: ['app', 'controllers/exportcontroller'],
    tagOnly: true
  },

  /* ExportConfiguration */
  { name: 'controllers/exportconfigurationcontroller' },
  { name: 'Intersport.VKLOHN.ExportConfigurationController',
      requires: ['app', 'controllers/exportconfigurationcontroller'],
      tagOnly: true
  },

  /* ImportFilter */
  { name: 'controllers/importcontroller' },
  { name: 'Intersport.VKLOHN.ImportController',
      requires: ['app', 'controllers/importcontroller'],
      tagOnly: true
  },

  /* ImportSelection */
  {name: 'controllers/importselectioncontroller' },
  {name: 'controls/tristate.checkbox' },
  { name: 'Intersport.VKLOHN.ImportSelectionController',
      requires: ['app', 'controls/tristate.checkbox', 'controllers/importselectioncontroller'],
      tagOnly: true
  }
		
];
