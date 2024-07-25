// Initial array of quotes
const quotes = [
  { text: "The only limit to our realization of tomorrow is our doubts of today.", category: "Motivation" },
  { text: "Life is what happens when you're busy making other plans.", category: "Life" },
  { text: "The purpose of our lives is to be happy.", category: "Happiness" },
];

// Function to display a random quote
function showRandomQuote() {
  const quoteDisplay = document.getElementById('quoteDisplay');
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const randomQuote = quotes[randomIndex];
  quoteDisplay.innerHTML = `<p>"${randomQuote.text}"</p><p>- ${randomQuote.category}</p>`;
}

// Function to create the form for adding new quotes
function createAddQuoteForm() {
  const addQuoteFormContainer = document.getElementById('addQuoteFormContainer');
  
  const newQuoteTextInput = document.createElement('input');
  newQuoteTextInput.id = 'newQuoteText';
  newQuoteTextInput.type = 'text';
  newQuoteTextInput.placeholder = 'Enter a new quote';
  
  const newQuoteCategoryInput = document.createElement('input');
  newQuoteCategoryInput.id = 'newQuoteCategory';
  newQuoteCategoryInput.type = 'text';
  newQuoteCategoryInput.placeholder = 'Enter quote category';
  
  const addQuoteButton = document.createElement('button');
  addQuoteButton.id = 'addQuoteButton';
  addQuoteButton.textContent = 'Add Quote';
  addQuoteButton.addEventListener('click', addQuote);

  addQuoteFormContainer.appendChild(newQuoteTextInput);
  addQuoteFormContainer.appendChild(newQuoteCategoryInput);
  addQuoteFormContainer.appendChild(addQuoteButton);
}

// Function to add a new quote
function addQuote() {
  const newQuoteText = document.getElementById('newQuoteText').value;
  const newQuoteCategory = document.getElementById('newQuoteCategory').value;
  if (newQuoteText && newQuoteCategory) {
      quotes.push({ text: newQuoteText, category: newQuoteCategory });
      document.getElementById('newQuoteText').value = '';
      document.getElementById('newQuoteCategory').value = '';
      alert('New quote added successfully!');
  } else {
      alert('Please enter both a quote and a category.');
  }
}

// Verify and add event listener for showing a new random quote
document.getElementById('newQuote').addEventListener('click', function() {
  console.log('Show New Quote button clicked');
  showRandomQuote();
});

// Initial setup
createAddQuoteForm();
showRandomQuote();
