const express = require('express');
const app = express();
const port = 3000;

console.log("Calculator route loaded...");

// Calculator route
app.get('/calculate', (req, res) => {
  const { operation, num1, num2 } = req.query;

  // Check if numbers are provided
  if (!num1 || !num2) {
    return res.status(400).json({ error: "Please provide both num1 and num2" });
  }

  const n1 = parseFloat(num1);
  const n2 = parseFloat(num2);

  if (isNaN(n1) || isNaN(n2)) {
    return res.status(400).json({ error: "num1 and num2 must be valid numbers" });
  }

  let result;
  switch (operation) {
    case 'add':
      result = n1 + n2;
      break;
    case 'subtract':
      result = n1 - n2;
      break;
    case 'multiply':
      result = n1 * n2;
      break;
    case 'divide':
      result = n2 !== 0 ? n1 / n2 : 'Error: Division by zero';
      break;
    default:
      return res.status(400).json({ error: "Invalid operation. Use add, subtract, multiply, or divide" });
  }

  res.json({ result });
});

// Default route
app.get('/', (req, res) => {
  res.send("Welcome to Calculator API! Use /calculate?operation=add&num1=10&num2=5");
});

// Start server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
