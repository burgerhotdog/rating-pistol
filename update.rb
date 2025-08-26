require 'selenium-webdriver'
require 'nokogiri'
require 'json'
require 'open-uri'

BASE_URL = {
  gi: "https://gi20.hakush.in/",
  hsr: "https://hsr20.hakush.in/",
  ww: "https://ww2.hakush.in/",
  zzz: "https://zzz3.hakush.in/",
}

ELEMENTS = {
  gi: ['Anemo', 'Cryo', 'Dendro', 'Electro', 'Geo', 'Hydro', 'Pyro'],
  hsr: ['Fire', 'Wind', 'Physical', 'Lightning', 'Quantum', 'Imaginary'],
}

VALID_GAME_IDS = ['gi', 'hsr', 'ww', 'zzz']
VALID_IMPORT_TYPES = ['avatar', 'weapon']

unless ARGV.length == 3 && VALID_GAME_IDS.include?(ARGV[0]) && VALID_IMPORT_TYPES.include?(ARGV[1])
  abort "Usage: ruby update.rb <#{VALID_GAME_IDS.join('|')}> <#{VALID_IMPORT_TYPES.join('|')}> <id>"
end
GAME_ID = ARGV[0]
IMPORT_TYPE = ARGV[1]
ID = ARGV[2]

url_tag = (GAME_ID == 'hsr' ? 'char/' : 'character/') if IMPORT_TYPE == 'avatar'
url_tag = (GAME_ID == 'hsr' ? 'lightcone/' : 'weapon/') if IMPORT_TYPE == 'weapon'

# Selenium setup - needed because these sites use JavaScript to load content dynamically
# Nokogiri alone cannot handle JavaScript-rendered content, so we need Selenium first
options = Selenium::WebDriver::Chrome::Options.new
options.add_argument('--headless')
options.add_argument('--disable-gpu')
options.add_argument('--window-size=1920,1080')
options.add_argument('--log-level=3')
driver = Selenium::WebDriver.for :chrome, options: options
wait = Selenium::WebDriver::Wait.new(timeout: 10)

# First page load - get the character/weapon list page to find the icon
puts "Loading #{BASE_URL[GAME_ID.to_sym]}#{url_tag}..."
driver.get("#{BASE_URL[GAME_ID.to_sym]}#{url_tag}")
# Wait for the specific character's icon to load before proceeding
wait.until { driver.find_element(css: "a[href='/#{url_tag}#{ID}'] > img.avatar-icon-front") }
puts "Complete"
doc_icon = Nokogiri::HTML(driver.page_source)  # Parse the loaded page for icon extraction

# Second page load, get the detailed character/weapon data page
puts "Loading #{BASE_URL[GAME_ID.to_sym]}#{url_tag}#{ID}..."
driver.get("#{BASE_URL[GAME_ID.to_sym]}#{url_tag}#{ID}/")
# Wait for essential data elements to load
wait.until { driver.find_element(css: '#char-name-info > span.char-name > div.stars img.star-icon') }
wait.until { driver.find_element(css: 'div.col-span-2 > div.grid > div.grid.grid-cols-2') }
puts "Complete"
doc_data = Nokogiri::HTML(driver.page_source)  # Parse the loaded page for data extraction
driver.quit

# Icon extraction
img_url = doc_icon.at_css("a[href='/#{url_tag}#{ID}'] > img.avatar-icon-front")&.[]('src')
# Special case for Genshin Impact weapons, append "_Awaken"
img_url.insert(-6, "_Awaken") if IMPORT_TYPE == 'weapon' && GAME_ID == 'gi'
puts "Downloading image: #{img_url}"
filename = File.join('src', 'assets', 'dynamic', "#{IMPORT_TYPE}", "#{GAME_ID}_#{IMPORT_TYPE}", "#{ID}.webp")
URI.open(img_url) do |image|
  File.open(filename, 'wb') { |file| file.write(image.read) }
end
puts "Saved at #{filename}"

data = {
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
  weights: {},
}

puts "Compiling data for: #{ID}..."
title = doc_data.at_css('#char-name-info')
data[:name] = title.at_css('div.char-name-text')&.text&.strip
data[:rarity] = title.css('span.char-name > div.stars img.star-icon').size

if IMPORT_TYPE == 'avatar' && (GAME_ID == 'ww' || GAME_ID == 'zzz')
  data[:element] = title.css('span.char-name > div.base-type-text')&.text&.tr("\u00A0", "")&.strip
end

doc_data.css('div.col-span-2 > div.grid > div.grid.grid-cols-2').each do |row|
  divs = row.css('div')
  next unless divs.size == 2

  key = divs[0]&.text&.strip
  value = divs[1]&.text&.strip

  case key
  when "Base HP" then data[:baseStats][:_HP] = value.to_i
  when "Base ATK" then data[:baseStats][:_ATK] = value.to_i
  when "Base DEF" then data[:baseStats][:_DEF] = value.to_i
  when "Weapon"
    data[:type] = value if IMPORT_TYPE == 'avatar' && GAME_ID != 'hsr'
  when "Type"
    data[:type] = value if IMPORT_TYPE == 'weapon' && GAME_ID != 'hsr'
  when "Path"
    data[:type] = value.split[1] if GAME_ID == 'hsr'
  else
    if IMPORT_TYPE == 'avatar' && (GAME_ID == 'gi' || GAME_ID == 'hsr')
      data[:element] = value if ELEMENTS[GAME_ID.to_sym].include?(value)
    end
  end
end

data.delete(:sig) unless GAME_ID == 'zzz' || data[:rarity] == 5

data.delete(:element) if IMPORT_TYPE == 'weapon'
data.delete(:sig) if IMPORT_TYPE == 'weapon'
data.delete(:weights) if IMPORT_TYPE == 'weapon'

# Genshin Impact weapon values are scraped at level 1
if IMPORT_TYPE == 'weapon' && GAME_ID == 'gi'
  case data[:rarity]
  when 1 then data[:baseStats][:_ATK] = 185
  when 2 then data[:baseStats][:_ATK] = 243
  when 3
    case data[:baseStats][:_ATK]
    when 38 then data[:baseStats][:_ATK] = 354
    when 39 then data[:baseStats][:_ATK] = 401
    when 40 then data[:baseStats][:_ATK] = 448
    end
  when 4
    case data[:baseStats][:_ATK]
    when 39 then data[:baseStats][:_ATK] = 440
    when 41 then data[:baseStats][:_ATK] = 454
    when 42 then data[:baseStats][:_ATK] = 510
    when 44 then data[:baseStats][:_ATK] = 565
    when 45 then data[:baseStats][:_ATK] = 620
    end
  when 5
    case data[:baseStats][:_ATK]
    when 44 then data[:baseStats][:_ATK] = 542
    when 46 then data[:baseStats][:_ATK] = 608
    when 48 then data[:baseStats][:_ATK] = 674
    when 49 then data[:baseStats][:_ATK] = 741
    end
  end
end

data[:baseStats].delete(:_HP) if IMPORT_TYPE == 'weapon' && GAME_ID != 'hsr'
data[:baseStats].delete(:_DEF) if IMPORT_TYPE == 'weapon' && GAME_ID != 'hsr'

puts JSON.pretty_generate(data)
puts
