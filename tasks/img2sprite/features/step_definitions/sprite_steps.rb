require 'spec/expectations'
#require 'cucumber/formatter/unicode'
require 'sprite'

Given /^I have a Sprite with image '([\d\w]*\.(?:png|gif))' and style '([\d\w]*\.css)'$/ do |image,style|
	@sprite = SpriteCollection.new "sprite", image, style
end

And /^I add the image '([\d\w]*\.(?:png|gif))'$/ do |image|
	@sprite << 'fixtures/' + image
end

When /^I write the sprite to disk$/ do
	@sprite.write
end

Then /^'([\d\w]*\.(?:png|gif))' should contain (\d*) images$/ do |image,count|
	File.exist?(image).should be_true
end

And /'([\d\w]*\.css)' should exist/ do |filename|
	File.exist?(filename).should be_true
end