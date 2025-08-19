require 'selenium-webdriver'
require 'nokogiri'
require 'json'
require 'open-uri'

BASE_URL = "https://gi20.hakush.in/character/"
ELEMENTS = ["Anemo", "Cryo", "Dendro", "Electro", "Geo", "Hydro", "Pyro"]
CHAR_IDS = [10000119, 10000120, 10000121]

options = Selenium::WebDriver::Chrome::Options.new
options.add_argument('--headless')
options.add_argument('--disable-gpu')
options.add_argument('--window-size=1920,1080')

driver = Selenium::WebDriver.for :chrome, options: options
output = {}

CHAR_IDS.each do |id|
  url = "#{BASE_URL}#{id}"
  puts "Fetching #{url}..."
  driver.get(url)
  wait = Selenium::WebDriver::Wait.new(timeout: 10)
  begin
    wait.until { driver.find_element(css: '#character-kit .grid-cols-2') }
  rescue Selenium::WebDriver::Error::TimeoutError
    puts "Timeout Error"
    next
  end

  doc = Nokogiri::HTML(driver.page_source)
  character = {
    name: '',
    rarity: '',
    element: '',
    type: '',
    sig: 0,
    baseStats: {
      _HP: 0,
      _ATK: 0,
      _DEF: 0,
    },
    weights: {}
  }

  title = doc.at_css('#char-name-info')
  character[:name] = title.at_css('div.char-name-text')&.text&.strip
  character[:rarity] = title.css('span.char-name > div.flex.stars img.star-icon').size
  character.delete(:sig) if character[:rarity] == 4

  doc.css('#character-kit .grid-cols-2').each do |row|
    divs = row.css('div')
    next unless divs.size >= 2

    key   = divs[0]&.text&.strip
    value = divs[1]&.text&.strip

    case key
    when "Weapon" then character[:type] = value
    when "Base HP" then character[:baseStats][:_HP] = value.to_i
    when "Base ATK" then character[:baseStats][:_ATK] = value.to_i
    when "Base DEF" then character[:baseStats][:_DEF] = value.to_i
    else
      if ELEMENTS.include?(value)
        character[:element] = value
      end
    end
  end

  output[id] = character
end

driver.get(BASE_URL)
wait = Selenium::WebDriver::Wait.new(timeout: 10)
begin
  wait.until { driver.find_element(css: 'div.grid.grid-cols-4') }
rescue Selenium::WebDriver::Error::TimeoutError
  puts "Timeout Error"
  exit
end

main_doc = Nokogiri::HTML(driver.page_source)

CHAR_IDS.each do |id|
  a_tag = main_doc.at_css("a[href='/character/#{id}']")
  if a_tag
    img_tag = a_tag.at_css('img[alt="character icon"]')
    if img_tag
      img_url = img_tag['src']
      puts "Downloading image: #{img_url}"
      filename = "#{id}.webp"
      URI.open(img_url) do |image|
        File.open(filename, 'wb') { |file| file.write(image.read) }
      end
      puts "Saved as #{filename}"
    else
      puts "Error: No icon found for #{id}"
    end
  else
    puts "Error: No link found for #{id}"
  end
end

puts JSON.pretty_generate(output)
driver.quit
