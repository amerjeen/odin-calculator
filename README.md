# Odin calculator
Calculator for The Odin Project - Foundation course

# Step-by-step approach (instructions only)

1. Start with your `index.html`
    - Create a container element for the calculator
    - Add a display element that shows current input/result
    - Add buttons for digits (0-9), operators (+, -, ×, ÷), equals (=), decimal point (.), clear, and possibly backspace
    - Use semantic elements like <button> or styled <div> for buttons
    - Arrange buttons logically (digits grouped, operators on the side or bottom)

2. Create styles in styles.css
    - Use CSS Grid or Flexbox to lay out buttons in rows and columns like a calculator keypad
    - Style the display to stand out, with readable font size and alignment
    - Style buttons with padding, hover/active effects, consistent sizing
    - Consider responsive design if you want it to look good at different screen sizes
    - Add clear visual feedback for button presses (like color change)

3. Work with your javascript.js
    1. Define basic math functions
        - Create separate functions for add, subtract, multiply, divide
    2. Create an operate function
        - Takes operator and two numbers, calls the appropriate math function, returns the result
    3. Define variables to hold state
        - Variables to store:
            - First number entered
            - Operator selected
            - Second number entered
            - Flag indicating if the last action was = or operator, to control input behavior
    4. Setup event listeners on buttons
        - When a digit button is clicked:
            - If last action was result display, start fresh
            - Otherwise, append digit to current input
            - Update display
            - When an operator button is clicked:
            - If no first number, store current input as first number
            - If operator already stored and second number exists, calculate intermediate result and set as first number
            - Store new operator
            - Prepare to receive second number
            - When equals button is clicked:
            - Validate there is a first number, operator, and second number
            - Calculate result with operate
            - Display result
            - Update state variables for next input
            - When clear button is clicked:
            - Reset all stored variables
            - Clear display
            - When decimal button is clicked:
            - Make sure decimal not already present in the current input
            - Append decimal point correctly
            - (Optional) Backspace removes last digit from current input

    5. Handle errors and edge cases
        - Division by zero should show an error, not crash
        - Ignore extra operator presses without numbers in between
        - Avoid multiple decimals in one number
        - Round numbers with many decimals