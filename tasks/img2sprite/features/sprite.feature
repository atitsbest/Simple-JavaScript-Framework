Feature: Create a single Sprite from mutliple image files
	In order to reduce HTTP requests
	As a Developer
	I want to combine multiple images into one single image
	And access the single images via css
	
	Scenario: Multiple images are added to the SpriteCollection
		Given I have a Sprite with image 'image.png' and style 'style.css'
		And I add the image 'img01.png'
		And I add the image 'img02.png'
		And I add the image 'img03.gif'
		When I write the sprite to disk
		Then 'image.png' should contain 3 images
		And 'style.css' should exist
		