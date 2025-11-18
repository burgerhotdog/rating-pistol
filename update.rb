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

unless ARGV.length >= 3 && VALID_GAME_IDS.include?(ARGV[0]) && VALID_IMPORT_TYPES.include?(ARGV[1])
  abort "Usage: ruby update.rb <#{VALID_GAME_IDS.join('|')}> <#{VALID_IMPORT_TYPES.join('|')}> <id1> <id2> ..."
end

GAME_ID = ARGV.shift
IMPORT_TYPE = ARGV.shift
IDS = ARGV

@url_tag = (GAME_ID == 'hsr' ? 'char/' : 'character/') if IMPORT_TYPE == 'avatar'
@url_tag = (GAME_ID == 'hsr' ? 'lightcone/' : 'weapon/') if IMPORT_TYPE == 'weapon'

# Selenium initialization
@options = Selenium::WebDriver::Chrome::Options.new
@options.add_argument('--headless')
@options.add_argument('--disable-gpu')
@options.add_argument('--window-size=1920,1080')
@options.add_argument('--log-level=3')
@driver = Selenium::WebDriver.for :chrome, options: @options
@wait = Selenium::WebDriver::Wait.new(timeout: 10)

def scrape_single_id(id)
  # Image
  # Load grid page and wait for icon to load
  puts "Loading image..."
  @driver.get("#{BASE_URL[GAME_ID.to_sym]}#{@url_tag}")
  @wait.until { @driver.find_element(css: "a[href='/#{@url_tag}#{id}'] > img.avatar-icon-front") }
  doc_icon = Nokogiri::HTML(@driver.page_source)

  img_url = doc_icon.at_css("a[href='/#{@url_tag}#{id}'] > img.avatar-icon-front")&.[]('src')
  # Special case for Genshin Impact weapons, append "_Awaken"
  img_url.insert(-6, "_Awaken") if IMPORT_TYPE == 'weapon' && GAME_ID == 'gi'
  puts "Downloading image: #{img_url}"
  filename = File.join('src', 'assets', "#{IMPORT_TYPE}", "#{GAME_ID}", "#{id}.webp")
  URI.open(img_url) do |image|
    File.open(filename, 'wb') { |file| file.write(image.read) }
  end
  puts "Saved at #{filename}"

  # Data
  # Load stats page and wait for essential data elements to load
  puts "Loading #{BASE_URL[GAME_ID.to_sym]}#{@url_tag}#{id}..."
  @driver.get("#{BASE_URL[GAME_ID.to_sym]}#{@url_tag}#{id}/")
  @wait.until { @driver.find_element(css: '#char-name-info > span.char-name > div.stars img.star-icon') }
  @wait.until { @driver.find_element(css: 'div.col-span-2 > div.grid > div.grid.grid-cols-2') }
  doc_data = Nokogiri::HTML(@driver.page_source)

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

  puts "Compiling data..."
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
    when "ATK"
      data[:baseStats][:_ATK] = value.to_i if GAME_ID == 'ww'
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
  
  puts "Complete"
  puts
  return data
end

results = {}
IDS.each do |id|
  puts "Processing ID #{id}..."
  results[id] = scrape_single_id(id)
end

@driver.quit

sorted = results.sort_by { |id, _| -id.to_i }.to_h
puts "Data list:"
puts JSON.pretty_generate(sorted)
puts
