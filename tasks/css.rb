require(File.join(File.dirname(__FILE__), 'img2sprite', 'sprite.rb'))

namespace :css do

	desc "Alle Dateien im Verzeichnis Content/Images/Sprites werden zu einem Sprite zusammengefasst und in Content/Css wird ein sprite.css erstellt."
	task :sprites do 
		# Verzeichnispfade ermitteln.
		images_dir = 'content/images'
		sprites_dir = File.join(images_dir, 'sprites')
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
			sprite = SpriteCollection.new(File.join(images_dir, 'sprites.png'), File.join(css_dir, 'sprites.css'))
			
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

end