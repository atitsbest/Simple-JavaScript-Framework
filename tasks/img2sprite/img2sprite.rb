require File.dirname(__FILE__) + '/sprite.rb'

# _______________________________________________
# So soll's verwendet werden.
usage =<<-EOD
  Usage: #{$0} <sprites_path> <output_image.ext> <output_styles.css>

  <output_image> braucht eine Erweiterung (z.B.: png, gif, ...)

  Example: #{$0} content/images/sprites toolbar_sprites.png toolbar_sprites.css
EOD

puts usage and exit if ARGV.size < 3

# Alle Dateien mit der gewünschten Erweiterung
image_names = Dir.glob(File.join($*[0], "*.png")) +
              Dir.glob(File.join($*[0], "*.gif"))
image_names = image_names.uniq.sort {|a,b| a.downcase <=> b.downcase }

# _______________________________________________
# Sprite erzeugen
puts "Sprite erstellen..."
sprite = SpriteCollection.new($*[1], $*[2])

image_names.each do |filename|
  puts filename
  begin
    sprite << filename
  rescue
    puts "Datei #{filename} konnte nicht geöffnet werden!"
  end
end

# Sprite (img+css) erzeugen
puts "Dateien #{$*[1]} und #{$*[2]} schreiben..."
sprite.write()
puts "Fertig!"
