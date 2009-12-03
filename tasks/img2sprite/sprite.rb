#!/usr/bin/env ruby
#
# Build a concatenated list of images. Intended to build a sprite suitable
# for use with the CSS sprite technique.
#
# The image grows from left to right.
#
# See this: http://www.alistapart.com/articles/sprites

require 'rubygems'
require 'rmagick'
require 'erubis'

include Magick

#
# Fügt mehrer Bilder zu einem einzelnen (Sprite) zusammen und kann auch 
# einen passenden CSS erzeugen.
class SpriteCollection

  # CTR
  def initialize(image_filename, css_filename)
		# Argument überprüfen
		raise ArgumentError if (image_filename.nil? or image_filename.empty?)
		raise ArgumentError if (css_filename.nil? or css_filename.empty?)
		# Argumente zuweisen.
		@image_filename = image_filename
		@css_filename = css_filename
		
		# Neues Bild erstellen.
		@image = Image.new(0,0)
    @image_details = []
  end

  # Ein Bild zum Sprite hinzufügen.
  def <<(filename)
    new_image = Image.read(filename).pop
    @image_details << {
      :filename => filename,
      :x => @image.columns,
      :y => 0,
      :width => new_image.columns,
      :height => new_image.rows
    }
    # Grow the container image to accomodate the new image dimensions.
    required_cols = new_image.columns + @image.columns
    required_rows = new_image.rows > @image.rows ? new_image.rows : @image.rows
		
    # FIXME resize creates a memory allocation error? OSX.
    #@image.resize!(required_cols, required_rows)
    # Resize the container by creating a new image with the required dimensions
    # and then splatting the container image at 0,0.
    container = @image.copy
    @image = Image.new(required_cols, required_rows) {  self.background_color = 'none' }
    @image.composite!(container, 0, 0, OverCompositeOp)
    # Paste the new image in to the container.
    @image.composite!(new_image, container.columns, 0, OverCompositeOp)
  end

  # Sprite und CSS schreiben.
  def write
		self.write_img
		self.write_css
  end
  
  # Die Bilddateim mit allen Bildern schreiben.
  def write_img
		@image.write(@image_filename)
  end

  # Das CSS schreiben.
  def write_css
		# INFO: image_filename wird von der erubis-Vorlage verwendet.
		# CSS-Datei speichern
		File.open(@css_filename,  "w") {|f| f.write(self.to_css)}
  end

	# Lieft den CSS als string zurück
	def to_css
		# Die CSS-Datei...
		eruby = Erubis::Eruby.new(File.read(File.dirname(__FILE__) + "\\css.eruby"))
		
		# ...rendern.
		eruby.result(binding())
	end
	
  # Print details as to where each image is located, and it's dimensions.
  def to_s
    order = [:x, :y, :width, :height, :filename]
    puts order.join("\t")
    puts '-' * 40
    @image_details.each do |details|
      # Print the dtails in the order required.
      values = order.clone
      values.map! {|v| details.send(v)}
      puts values.join("\t")
    end
  end
  
end
