require 'selenium-webdriver'
require 'nokogiri'
require 'json'
require 'open-uri'

VALID_GAME_IDS = ['gi', 'hsr', 'ww', 'zzz']
unless ARGV.length == 1 && VALID_GAME_IDS.include?(ARGV[0])
  abort "Usage: ruby update.rb <#{VALID_GAME_IDS.join('|')}>"
end

GAME_ID = ARGV[0]
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

options = Selenium::WebDriver::Chrome::Options.new
options.add_argument('--headless')
options.add_argument('--disable-gpu')
options.add_argument('--window-size=1920,1080')
options.add_argument('--log-level=3')

loop do
  puts "Enter <a|w> for avatar|weapon, or <q> to quit:"
  input = STDIN.gets.strip

  case input
  when 'a'
    puts "Enter avatar id:"
    id = STDIN.gets.strip

    driver = Selenium::WebDriver.for :chrome, options: options
    wait = Selenium::WebDriver::Wait.new(timeout: 10)
    url_tag = GAME_ID == 'hsr' ? 'char/' : 'character/'
    url = "#{BASE_URL[GAME_ID.to_sym]}#{url_tag}"

    # icon
    driver.get(url)
    wait.until { driver.find_element(css: "a[href='/#{url_tag}#{id}'] > img.avatar-icon-front") }
    doc_icon = Nokogiri::HTML(driver.page_source)

    img_url = doc_icon.at_css("a[href='/#{url_tag}#{id}'] > img.avatar-icon-front")&.[]('src')
    puts "Downloading image: #{img_url}"
    filename = File.join('src', 'assets', 'dynamic', 'avatar', "#{GAME_ID}_avatar", "#{id}.webp")
    URI.open(img_url) do |image|
      File.open(filename, 'wb') { |file| file.write(image.read) }
    end
    puts "Saved as #{filename}"

    # data
    driver.get("#{url}#{id}/")
    wait.until { driver.find_element(css: '#char-name-info > span.char-name > div.stars img.star-icon') }
    wait.until { driver.find_element(css: '#character-kit > .grid:first-child .grid-cols-2') }
    doc_data = Nokogiri::HTML(driver.page_source)

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

    title = doc_data.at_css('#char-name-info')
    data[:name] = title.at_css('div.char-name-text')&.text&.strip
    data[:rarity] = title.css('span.char-name > div.stars img.star-icon').size
    data.delete(:sig) if data[:rarity] == 4
    if GAME_ID == 'ww' || GAME_ID == 'zzz'
      data[:element] = title.css('span.char-name > div.base-type-text')&.text&.tr("\u00A0", "")&.strip
    end

    doc_data.css('#character-kit > .grid:first-child .grid-cols-2').each do |row|
      divs = row.css('div')
      next unless divs.size == 2

      key = divs[0]&.text&.strip
      value = divs[1]&.text&.strip

      case key
      when "Base HP" then data[:baseStats][:_HP] = value.to_i
      when "Base ATK" then data[:baseStats][:_ATK] = value.to_i
      when "Base DEF" then data[:baseStats][:_DEF] = value.to_i
      when "Weapon" then data[:type] = value if GAME_ID != 'hsr'
      when "Path" then data[:type] = value.split[1] if GAME_ID == 'hsr'
      else
        if GAME_ID == 'gi' || GAME_ID == 'hsr'
          if ELEMENTS[GAME_ID.to_sym].include?(value)
            data[:element] = value
          end
        end
      end
    end

    puts JSON.pretty_generate(data)

    driver.quit
    puts
  when 'w'
    break
  when 'q'
    break
  else
    puts "Invalid input, please try again."
  end
end

exit 1
