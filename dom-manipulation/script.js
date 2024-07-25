const serverUrl = 'https://jsonplaceholder.typicode.com/posts'; // Simulated server URL

let quotes = JSON.parse(localStorage.getItem('quotes')) || [
    { text: "The only limit to our realization of tomorrow is our doubts of today.", category: "Motivation" },
    { text: "Life is what happens when you're busy making other plans.", category: "Life" },
    { text: "The purpose of our lives is to be happy.", category: "Happiness" },
];

let selectedCategory = localStorage.getItem('selectedCategory') || 'all';

function saveQuotes() {
    localStorage.setItem('quotes', JSON.stringify(quotes));
    syncWithServer();
}

function populateCategories() {
    const categoryFilter = document.getElementById('categoryFilter');
    const categories = [...new Set(quotes.map(quote => quote.category))];
    categoryFilter.innerHTML = '<option value="all">All Categories</option>';
    categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category;
        categoryFilter.appendChild(option);
    });
    categoryFilter.value = selectedCategory;
}

function showRandomQuote() {
    const quoteDisplay = document.getElementById('quoteDisplay');
    const filteredQuotes = quotes.filter(quote => selectedCategory === 'all' || quote.category === selectedCategory);
    
    console.log("Filtered Quotes:", filteredQuotes); // Debugging log

    if (filteredQuotes.length === 0) {
        quoteDisplay.innerHTML = `<p>No quotes available for the selected category.</p>`;
        return;
    }
    const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
    const randomQuote = filteredQuotes[randomIndex];
    quoteDisplay.innerHTML = `<p>"${randomQuote.text}"</p><p>- ${randomQuote.category}</p>`;
    sessionStorage.setItem('lastViewedQuote', JSON.stringify(randomQuote));
}

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

function addQuote() {
    const newQuoteText = document.getElementById('newQuoteText').value;
    const newQuoteCategory = document.getElementById('newQuoteCategory').value;
    if (newQuoteText && newQuoteCategory) {
        quotes.push({ text: newQuoteText, category: newQuoteCategory });
        saveQuotes(); 
        populateCategories(); 
        document.getElementById('newQuoteText').value = '';
        document.getElementById('newQuoteCategory').value = '';
        alert('New quote added successfully!');
    } else {
        alert('Please enter both a quote and a category.');
    }
}

function filterQuotes() {
    selectedCategory = document.getElementById('categoryFilter').value;
    localStorage.setItem('selectedCategory', selectedCategory); 
    showRandomQuote();
}

function exportQuotes() {
    const dataStr = JSON.stringify(quotes);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const exportFileDefaultName = 'quotes.json';
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', url);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
}

function importFromJsonFile(event) {
    const fileReader = new FileReader();
    fileReader.onload = function(event) {
        const importedQuotes = JSON.parse(event.target.result);
        importedQuotes.forEach(quote => {
            if (!quote.text && quote.title) {
                quote.text = quote.title;
                quote.category = 'Imported';
            }
        });
        quotes.push(...importedQuotes);
        saveQuotes(); 
        populateCategories(); 
        alert('Quotes imported successfully!');
    };
    fileReader.readAsText(event.target.files[0]);
}

async function fetchQuotesFromServer() {
    try {
        const response = await fetch(serverUrl);
        const serverQuotes = await response.json();
        return serverQuotes.map(quote => ({
            text: quote.title || quote.text,
            category: quote.category || 'Imported'
        }));
    } catch (error) {
        console.error('Error fetching quotes from server:', error);
        return [];
    }
}

async function syncWithServer() {
    try {
        const serverQuotes = await fetchQuotesFromServer();
        resolveConflicts(serverQuotes);
    } catch (error) {
        console.error('Error syncing with server:', error);
    }
}

function resolveConflicts(serverQuotes) {
    const localQuotes = JSON.parse(localStorage.getItem('quotes')) || [];
    const mergedQuotes = [...new Set([...localQuotes.map(q => JSON.stringify(q)), ...serverQuotes.map(q => JSON.stringify(q))])].map(quote => JSON.parse(quote));
    if (JSON.stringify(localQuotes) !== JSON.stringify(mergedQuotes)) {
        quotes = mergedQuotes;
        saveQuotes();
        document.getElementById('conflictNotification').style.display = 'block';
        setTimeout(() => {
            document.getElementById('conflictNotification').style.display = 'none';
        }, 5000);
    }
}

document.getElementById('newQuote').addEventListener('click', showRandomQuote);
document.getElementById('exportQuotes').addEventListener('click', exportQuotes);
document.getElementById('importFile').addEventListener('change', importFromJsonFile);

createAddQuoteForm();
populateCategories();
filterQuotes();

setInterval(syncWithServer, 10 * 60 * 1000);
syncWithServer();
