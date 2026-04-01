import sys

def select_option(prompt, options):
    options = list(options)
    print(prompt)
    for i, option in enumerate(options, start=1):
        print(f"{i}: {option}")

    while True:
        choice = input(f"Enter #(1-{len(options)}): ")
        try:
            index = int(choice) - 1
            if 0 <= index < len(options):
                option = options[index]
                return option
        except ValueError:
            pass
        print('Invalid input. Please try again.')
