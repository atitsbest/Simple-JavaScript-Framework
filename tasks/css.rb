require(File.join(File.dirname(__FILE__), 'img2sprite', 'sprite.rb'))
require(File.join(File.dirname(__FILE__), 'css', 'css_helper.rb'))
require(File.join(File.dirname(__FILE__), 'helper', 'dir_helper.rb'))

namespace :css do

	# Dateiname (ohne Pfad) der kompilierten CSS Datei.
	COMPILED_CSS_NAME = "#{APPLICATION_NAME}.css"

	desc "Alle Stylesheets jedes Verzeichnisses (inkl. Unterverz.) in einen einzelnen Stylesheet zusammenfassen"
	task :bundle do 
		# Alle Top-Level-Verzeichnisse ermitteln.
		dirs = get_top_level_directories(CSS_PATH) 
		
		# Pro Verzeichnis ein Bundle erstellen.
		dirs.each do |dir|
		
			# Alle Stylesheets ermitteln (combined.ccs und compiled.css nicht berücksichtigen):
			css_file_names = Dir.glob(File.join(CSS_PATH, dir, '**', '*.css')).reject do |f| 
				f.index(COMPILED_CSS_NAME)
			end
			
			bundle_name = "#{dir}.css"
			compiled_file = File.open(File.join(CSS_PATH, bundle_name), 'w')
			puts "==> #{bundle_name}.css"
			css_file_names.each do |name|
				puts name
				compiled_file.write(File.read(name))
			end
			compiled_file.close
		
			puts "Compress..."
			compile_css(bundle_name)	
		end
		
	end
end

# -------
# Helpers
#
def compile_css(file_name)
		yuipath = File.join(TOOLS_PATH, 'yuicompressor/yuicompressor-2.4.2.jar')
		targetpath = File.join(CSS_PATH, file_name)
		
		`java -jar #{yuipath} --line-break 0 #{targetpath} -o #{targetpath}`	
end

