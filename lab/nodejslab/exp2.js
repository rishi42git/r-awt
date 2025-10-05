function replaceAsWithB(inputString) {
  // Regular expression to match two or more 'a's
  const regex = /a{2,}/g;
  return inputString.replace(regex, 'b');
}

// Example usage
const result = replaceAsWithB("aaapple banaana caaar");
console.log(result); // Output: "bpple banbna cbar"
