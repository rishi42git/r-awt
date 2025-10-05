const express = require('express');
const app = express();
const port = 3000;

console.log("Calculator route loaded...");

// Calculator route
app.get('/calculate', (req, res) => {
  const { operation, num1, num2 } = req.query;
  const n1 = parseFloat(num1);
  const n2 = parseFloat(num2);

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
      result = 'Error: Invalid operation';
  }

  res.json({ result });
});

// Start server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
