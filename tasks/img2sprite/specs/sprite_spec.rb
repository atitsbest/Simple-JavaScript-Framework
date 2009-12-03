require "../sprite.rb"

module SpriteCollectionSpecHelpers
	# Ein Sprite mit 3 Bildern erstellen.
	def create_sprite_with_3_images(image_filename, css_filename)
		sprite = SpriteCollection.new image_filename, css_filename
		sprite << "../fixtures/img01.png"
		sprite << "../fixtures/img02.png"
		sprite << "../fixtures/img03.gif"
		return sprite
	end
end

describe SpriteCollection do 
	include SpriteCollectionSpecHelpers

	it "should take the output image file name and the output css file name as mandatory parameters" do 
		lambda {
			sprite = SpriteCollection.new "image.png", "style.css"
		}.should_not raise_error
	end
	
	it "should rais an error if any ctr parameter is not provided" do
		lambda {
			sprite = SpriteCollection.new
		}.should raise_error(ArgumentError)
		lambda {
			sprite = SpriteCollection.new("bild dateiname")
		}.should raise_error(ArgumentError)
	end
	
	it "should raise an error if it cannot add an image to the sprite" do
		sprite = SpriteCollection.new "bild.png", "bild.css"
		lambda { sprite << "einzelbild.png" }.should raise_error(Magick::ImageMagickError)
	end
	
	it "should add images (png & gif) to the sprite" do 
		create_sprite_with_3_images "image.png", "style.css"
	end

	it "write the created sprite to a single image file" do 
		File.delete "image.png" if File.exist? "image.png"
		sprite = create_sprite_with_3_images "image.png", "style.css"
		sprite.write_img
		File.exist?("image.png").should be_true
		# Hier kann ein Fehler passieren wenn:
		# 	* fixtures/img0x werden geändert
		# 	* fixtures/expected_image.png wird geändert.
		FileUtils.compare_file("../fixtures/expected_image.png", "image.png").should be_true
	end

	it "should write the created style sheet to a single file" do 
		File.delete "style.css" if File.exist? "style.css"
		sprite = create_sprite_with_3_images "image.png", "style.css"
		sprite.write_css
		File.exist?("style.css").should be_true
		# Hier kann ein Fehler passieren wenn:
		# 	* fixtures/img0x werden geändert
		# 	* fixtures/expected_style.css wird geändert
		# 	* css.eruby wird geändert
		FileUtils.compare_file("../fixtures/expected_style.css", "style.css").should be_true
	end
	
end