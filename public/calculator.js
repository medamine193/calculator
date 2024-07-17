let currentInput = '';
let operation = '';
let previousInput = '';

function appendNumber(number) {
  currentInput += number;
  updateDisplay();
}

function setOperation(op) {
  if (currentInput === '') return;
  if (previousInput !== '') {
    calculate();
  }
  operation = op;
  previousInput = currentInput;
  currentInput = '';
}

function calculate() {
  let result;
  const prev = parseFloat(previousInput);
  const current = parseFloat(currentInput);

  if (isNaN(prev) || isNaN(current)) return;

  switch (operation) {
    case '+':
      result = prev + current;
      break;
    case '-':
      result = prev - current;
      break;
    case '*':
      result = prev * current;
      break;
    case '/':
      result = prev / current;
      break;
    default:
      return;
  }

  currentInput = result;
  operation = '';
  previousInput = '';
  updateDisplay();
  saveOperation(`${prev} ${operation} ${current}`, result);
}

function clearDisplay() {
  currentInput = '';
  operation = '';
  previousInput = '';
  updateDisplay();
}

function updateDisplay() {
  const display = document.getElementById('display');
  display.value = currentInput;
}

async function saveOperation(expression, result) {
  try {
    await fetch('/save-operation', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ expression, result })
    });
  } catch (error) {
    console.error('Error saving operation:', error);
  }
}


