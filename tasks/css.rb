require(File.join(File.dirname(__FILE__), 'img2sprite', 'sprite.rb'))
require(File.join(File.dirname(__FILE__), 'css', 'css_helper.rb'))

namespace :css do

	# Dateiname (ohne Pfad) der kompilierten CSS Datei.
	COMPILED_CSS_NAME = "#{APPLICATION_NAME}.css"

	desc "Alle Dateien im Verzeichnis Content/Images/Sprites werden zu einem Sprite zusammengefasst und in Content/Css wird ein sprite.css erstellt."
	task :sprites do 
		# Verzeichnispfade ermitteln.
		sprites_dir = File.join(IMAGES_PATH, 'sprites')
		css_dir = 'content/css'

		# Alle Dateien mit der gewünschten Erweiterung
		image_names = Dir.glob(File.join(sprites_dir, "*.png")) +
		              Dir.glob(File.join(sprites_dir, "*.gif"))
		image_names = image_names.uniq.sort {|a,b| a.downcase <=> b.downcase }
		
		# Bilder gefunden?
		if image_names.length == 0
			puts "Keine Bilder in #{sprites_dir} gefunden."
		else
			# Sprite erzeugen
			puts "Bilder suchen in #{sprites_dir}..."
			sprite = SpriteCollection.new(File.join(IMAGES_PATH, 'sprites.png'), File.join(css_dir, 'sprites.css'))
			
			image_names.each do |filename|
			  puts filename
			  begin
			    sprite << filename
			  rescue
			    puts "Datei #{filename} konnte nicht geöffnet werden!"
			  end
			end
			
			# Sprite (img+css) erzeugen
			puts "Sprite schreiben..."
			sprite.write()
		end
		
		puts "Fertig!"
	end
	
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

def get_top_level_directories(root)
	Dir.entries(root).reject do |path| 
		!File.directory?(File.join(root, path)) or File.basename(path)[0] == ?.
	end
end

def compile_css(file_name)
		yuipath = File.join(TOOLS_PATH, 'yuicompressor/yuicompressor-2.4.2.jar')
		targetpath = File.join(CSS_PATH, file_name)
		
		`java -jar #{yuipath} --line-break 0 #{targetpath} -o #{targetpath}`	
end

