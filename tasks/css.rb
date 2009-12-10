require(File.join(File.dirname(__FILE__), 'img2sprite', 'sprite.rb'))

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
	
	desc "Stylesheets in eine einzelne Datei komprimieren"
	task :compile => [:combine] do 
		yuipath = File.join(TOOLS_PATH, 'yuicompressor/yuicompressor-2.4.2.jar')
		targetpath = File.join(CSS_PATH, COMPILED_CSS_NAME)
		
		`java -jar #{yuipath} --line-break 0 #{targetpath} -o #{targetpath}`	
	end
	
	desc "Alle Stylesheets in einen einzelnen Stylesheet zusammenfassen"
	task :combine do 
		# Alle Stylesheets ermitteln (combined.ccs und compiled.css nicht berücksichtigen):
		css_file_names = Dir.glob(File.join(CSS_PATH, '**', '*.css')).reject do |f| 
			f.index(COMPILED_CSS_NAME)
		end
		
		compiled_file = File.open(File.join(CSS_PATH, COMPILED_CSS_NAME), 'w')
		css_file_names.each do |name|
			puts name
			compiled_file.write(File.read(name))
		end
		compiled_file.close
	end
end
