import sys
from update import select_from_dict

game_ids = {
    'gi': 'Genshin Impact',
    'hsr': 'Honkai Star Rail',
    'ww': 'Wuthering Waves',
    'zzz': 'Zenless Zone Zero',
}
valid_choices = {str(i) for i in range(1, len(game_ids) + 1)}

def main():
    game_id = select_from_dict(game_ids, 'Select game to update:')

if __name__ == "__main__":
    main()
