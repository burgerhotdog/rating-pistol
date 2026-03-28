import sys

def select_from_dict(options: dict, prompt="Select an option:", allow_quit=True):
    keys = list(options.keys())

    print(prompt)
    for i, key in enumerate(keys, start=1):
        print(f"{i}: {options[key]}")

    valid_choices = {str(i) for i in range(1, len(keys) + 1)}

    while True:
        choice = input(f"Enter 1-{len(keys)}" + (" or q to quit: " if allow_quit else ": "))

        match choice:
            case 'q' if allow_quit:
                sys.exit()

            case _ if choice in valid_choices:
                index = int(choice) - 1
                return keys[index]

            case _:
                print("Invalid input.")
