def select_game_index(names):
    print("Select game to update:")
    for index, option in enumerate(names, start=1):
        print(f"{index}: {option}")

    while True:
        choice = input(f"Enter #(1-{len(names)}): ")
        try:
            index = int(choice) - 1
            if 0 <= index < len(names):
                return index
        except ValueError:
            pass
        print('Invalid input. Please try again.')
