/**
 * Hier werden die Abhängigkeiten unter den einzelnen Modulen
 * aufgelöst. 
 */
var dependencies = [
	
  /* System */
  { name: 'jquery/jquery-1.3.2.min' },
	{ name: 'mootools-1.2.4-core-nc' },
	{ name: 'mootools-1.2.4.2-more-nc' },
	{ name: 'class/mutators/static' },
	{ name: 'mvc' },
	{ name: 'controls/control' },
	{ name: 'app' },
	{ name: 'vklohn' },
	{ name: 'baselib', 
		requires: ['jquery/jquery-1.3.2.min',
							 'mootools-1.2.4-core-nc','mootools-1.2.4.2-more-nc','mutators/staticmutator',
							 'mvc','controls/control',
							 'app','vklohn'], 
		tagOnly: true },


  /* jQuery */
  { name: 'jquery/jquery.blockit' },
  { name: 'jquery/jquery.color' },
  { name: 'jquery/jquery.form' },
  { name: 'jquery/jquery.dimensions.pack' },
  { name: 'jquery/jquery.metadata' },
  { name: 'jquery/jquery.scrollto.min' },
	{ name: 'jquery', 
		requires: ['jquery/jquery.blockit','jquery/jquery.color','jquery/jquery.form','jquery/jquery.dimensions.pack',
		           'jquery/jquery.metadata','jquery/jquery.scrollto.min'], 
		tagOnly: true },
  

  /* Application */
  { name: 'controls/panel' },
	{ name: 'controls/message' },
	{ name: 'application' },
	{ name: 'appl', 
		requires: ['baselib','jquery','controls/control','controls/panel','controls/message', 'application'], 
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
