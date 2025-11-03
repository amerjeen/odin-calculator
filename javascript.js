// Math functions
function add(a, b) {
    return a + b;
}
function subtract(a, b) {
    return a - b;
}
function multiply(a, b) {
    return a * b;
}
function divide(a, b) {
    return b === 0 ? "Error" : a / b;
}

// Operator function (dispatch)
function operate(operator, a, b) {
    switch (operator) {
        case '+': return add(a, b);
        case '-': return subtract(a, b);
        case 'x': return multiply(a, b);
        case '/': return divide(a, b);
        default: return null;
    }
}

// State variables
let firstValue = "";
let secondValue = "";
let currentOperator = null;
let lastAction = "";        // "digit", "operator", "equals"
let shouldResetDisplay = false; // to clear display before next digit

// DOM references
const display = document.querySelector('.display');
const keys = document.querySelector('#keys');

// Update display helper
function updateDisplay(value) {
    display.textContent = value;
}

// Clear all calculator state, reset display
function clearCalculator() {
    firstValue = "";
    secondValue = "";
    currentOperator = null;
    lastAction = "";
    shouldResetDisplay = false;
    updateDisplay("0");
}

// Backspace logic: remove last char from current input number
function handleBackspace() {
    if (lastAction === "equals" || shouldResetDisplay) return; // can't backspace on result

    if (!currentOperator) {
        firstValue = firstValue.slice(0, -1);
        updateDisplay(firstValue || "0");
    } else {
        secondValue = secondValue.slice(0, -1);
        updateDisplay(secondValue || "0");
    }
}

// Handle digit (and decimal if passed as value)
function handleDigit(value) {
    // Start fresh after equals or reset flag
    if (lastAction === "equals" || shouldResetDisplay) {
        firstValue = "";
        secondValue = "";
        currentOperator = null;
        shouldResetDisplay = false;
        lastAction = "";
        updateDisplay("");
    }

    if (!currentOperator) {
        // Handling first number input

        if (value === ".") {
            // Allow decimal point only once
            if (!firstValue.includes(".")) {
                // If firstValue is empty, start with "0."
                firstValue = firstValue === "" ? "0." : firstValue + ".";
                updateDisplay(firstValue);
            }
            // Ignore if decimal already exists
            return;
        }

        // Prevent multiple leading zeros:
        if (firstValue === "0") {
            // If trying to enter another zero, ignore
            if (value === "0") return;

            // If entering non-zero digit, replace "0" with that digit
            firstValue = value;
            updateDisplay(firstValue);
            lastAction = "digit";
            return;
        }

        // Append digit normally
        firstValue += value;
        updateDisplay(firstValue);

    } else {
        // Handling second number input (after operator selected)

        if (value === ".") {
            if (!secondValue.includes(".")) {
                secondValue = secondValue === "" ? "0." : secondValue + ".";
                updateDisplay(secondValue);
            }
            return;
        }

        // Prevent multiple leading zeros for secondValue
        if (secondValue === "0") {
            if (value === "0") return;

            secondValue = value;
            updateDisplay(secondValue);
            lastAction = "digit";
            return;
        }

        // Append digit normally
        secondValue += value;
        updateDisplay(secondValue);
    }

    lastAction = "digit";
}

// Handle operator buttons (+, -, x, /)
function handleOperator(op) {
    // Ignore if no first number yet
    if (firstValue === "") return;

    // Ignore consecutive operator presses (don't overwrite operator without second value)
    if (lastAction === "operator") {
        currentOperator = op; // simply update operator, no calc performed
        return;
    }

    // If operator exists and secondValue entered, calculate intermediate result
    if (currentOperator && secondValue !== "") {
        let a = parseFloat(firstValue);
        let b = parseFloat(secondValue);

        let result = operate(currentOperator, a, b);
        if (result === "Error") {
            updateDisplay("Cannot divide by 0!");
            resetAfterError();
            return;
        }

        firstValue = roundResult(result);
        updateDisplay(firstValue);
        secondValue = "";
    }

    currentOperator = op;
    shouldResetDisplay = false;
    lastAction = "operator";
}

// Handle equals button
function handleEquals() {
    // Need full expression: a, op, b
    if (!currentOperator || secondValue === "") return;

    let a = parseFloat(firstValue);
    let b = parseFloat(secondValue);

    let result = operate(currentOperator, a, b);

    if (result === "Error") {
        updateDisplay("Cannot divide by 0!");
        resetAfterError();
        return;
    }

    result = roundResult(result);
    updateDisplay(result.toString());
    firstValue = result.toString();
    secondValue = "";
    currentOperator = null;
    lastAction = "equals";
    shouldResetDisplay = true;
}

// Handle decimal button (can be called separately if desired)
function handleDecimal() {
    if (lastAction === "equals" || shouldResetDisplay) {
        firstValue = "0.";
        secondValue = "";
        currentOperator = null;
        updateDisplay(firstValue);
        lastAction = "digit";
        shouldResetDisplay = false;
        return;
    }

    if (!currentOperator) {
        if (!firstValue.includes(".")) {
            firstValue = firstValue === "" ? "0." : firstValue + ".";
            updateDisplay(firstValue);
        }
    } else {
        if (!secondValue.includes(".")) {
            secondValue = secondValue === "" ? "0." : secondValue + ".";
            updateDisplay(secondValue);
        }
    }
}

// Rounds number to max 6 decimal places
function roundResult(num) {
    return Math.round(num * 1e6) / 1e6;
}

// Reset after error like division by zero
function resetAfterError() {
    firstValue = "";
    secondValue = "";
    currentOperator = null;
    lastAction = "";
    shouldResetDisplay = true;
}

// Initialize with zero displayed
clearCalculator();


// Main event listener with delegation
keys.addEventListener('click', (event) => {
    const key = event.target;
    if (!key.matches('button')) return;

    const value = key.value;

    if (key.classList.contains('all-clear')) {
        clearCalculator();
        return;
    }

    if (value === 'backspace') {
        handleBackspace();
        return;
    }

    if (!isNaN(value) || value === '.') {
        if (value === '.') {
            handleDecimal();
        } else {
            handleDigit(value);
        }
        return;
    }

    if (key.classList.contains('operator') && value !== '=') {
        handleOperator(value);
        return;
    }

    if (value === '=') {
        handleEquals();
        return;
    }
});
