// Initialize quotes array from localStorage or default quotes
let quotes = JSON.parse(localStorage.getItem("quotes")) || [
  { text: "With great power comes great responsibility", category: "motivation" },
  { text: "Surviving is winning Franklin...Everything else is bullshit", category: "humor" },
  { text: "As long as there are those who remember what was, there will always be those who cannot accept what can be", category: "wisdom" }
];

// Dynamically create Add Quote form
function createAddQuoteForm() {
    let div = document.createElement('div');

    let input1 = document.createElement('input');
    input1.id = "newQuoteText";
    input1.type = "text";
    input1.placeholder = "Enter a new quote";

    let input2 = document.createElement('input');
    input2.id = "newQuoteCategory";
    input2.type = "text";
    input2.placeholder = "Enter quote category";

    let button = document.createElement("button");
    button.textContent = "Add Quote";
    button.addEventListener('click', addQuote);

    div.appendChild(input1);
    div.appendChild(input2);
    div.appendChild(button);

    document.body.appendChild(div);
}

// Add a new quote
function addQuote() {
    let newQuoteText = document.getElementById('newQuoteText');
    let newQuoteCategory = document.getElementById('newQuoteCategory');

    if (!newQuoteText.value.trim() || !newQuoteCategory.value.trim()) {
        alert('Please enter both quote text and category.');
        return;
    }

    quotes.push({ text: newQuoteText.value.trim(), category: newQuoteCategory.value.trim() });
    localStorage.setItem("quotes", JSON.stringify(quotes));

    newQuoteText.value = '';
    newQuoteCategory.value = '';

    populateCategories();
    filterQuotes();
}

// Show random quote
function showRandomQuote() {
    let newQuotebtn = document.getElementById('newQuote');
    let quoteDisplay = document.getElementById('quoteDisplay');

    newQuotebtn.addEventListener('click', () => {
        if (quotes.length === 0) return;

        let randomIndex = Math.floor(Math.random() * quotes.length);
        let randomQuote = quotes[randomIndex];

        quoteDisplay.innerHTML = '';
        let p = document.createElement('p');
        p.textContent = `${randomQuote.text} - ${randomQuote.category}`;
        quoteDisplay.appendChild(p);
    });
}

// Export quotes to JSON
function exportToJsonFile() {
    const jsonData = JSON.stringify(quotes, null, 2);
    const blob = new Blob([jsonData], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "quotes.json";
    a.click();

    URL.revokeObjectURL(url);
}

// Import quotes from JSON
function importFromJsonFile(event) {
    const fileReader = new FileReader();
    fileReader.onload = function(e) {
        try {
            const importedQuotes = JSON.parse(e.target.result);
            quotes.push(...importedQuotes);
            localStorage.setItem("quotes", JSON.stringify(quotes));

            populateCategories();
            filterQuotes();

            alert('Quotes imported successfully!');
        } catch (err) {
            alert('Error importing file: ' + err);
        }
    };
    fileReader.readAsText(event.target.files[0]);
}

// Populate categories dropdown
function populateCategories() {
    let categoryFilter = document.getElementById('categoryFilter');
    categoryFilter.innerHTML = '<option value="all">All Categories</option>';

    const categories = [...new Set(quotes.map(q => q.category))];
    categories.forEach(category => {
        if (category.toLowerCase() === 'all') return;

        const option = document.createElement('option');
        option.value = category;
        option.textContent = category;
        categoryFilter.appendChild(option);
    });
}

// Filter quotes by selected category
function filterQuotes() {
    const categoryFilter = document.getElementById('categoryFilter');
    const quoteDisplay = document.getElementById('quoteDisplay');

    const selectedCategory = categoryFilter.value;
    localStorage.setItem('lastCategoryFilter', selectedCategory);

    quoteDisplay.innerHTML = '';

    const filteredQuotes = selectedCategory === 'all'
        ? quotes
        : quotes.filter(q => q.category === selectedCategory);

    filteredQuotes.forEach(q => {
        const p = document.createElement('p');
        p.textContent = `${q.text} - ${q.category}`;
        quoteDisplay.appendChild(p);
    });
}

// Initial setup
createAddQuoteForm();
showRandomQuote();
populateCategories();

const lastCategory = localStorage.getItem('lastCategoryFilter');
if (lastCategory) {
    document.getElementById('categoryFilter').value = lastCategory;
    filterQuotes();
}

const MOCK_API_URL = 'https://jsonplaceholder.typicode.com/posts';

// Function to fetch quotes from the server
async function fetchQuotesFromServer() {
    try {
        const response = await fetch(MOCK_API_URL);
        const serverData = await response.json();

        // Map server data to your quotes format
        const serverQuotes = serverData.slice(0, 5).map(item => ({
            text: item.title,
            category: item.body.split(' ')[0] || 'general'
        }));

        // Call syncQuotes to merge server data
        syncQuotes(serverQuotes);
    } catch (err) {
        console.error('Error fetching quotes from server:', err);
    }
}

// Function to sync server quotes with local quotes and resolve conflicts
function syncQuotes(serverQuotes) {
    let updated = false;

    serverQuotes.forEach(sq => {
        // Check if the quote already exists locally
        const exists = quotes.some(lq => lq.text === sq.text && lq.category === sq.category);

        // If not, add it (server data takes precedence)
        if (!exists) {
            quotes.push(sq);
            updated = true;
        }
    });

    if (updated) {
        localStorage.setItem('quotes', JSON.stringify(quotes));
        populateCategories(); // update category dropdown
        filterQuotes();       // refresh displayed quotes
        showNotification('Quotes updated from server!');
    }
}

// Function to simulate posting new quotes to the server
async function postQuoteToServer(quote) {
    try {
        await fetch(MOCK_API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(quote)
        });
        console.log('Quote posted to server:', quote);
    } catch (err) {
        console.error('Error posting quote to server:', err);
    }
}

// Notification helper
function showNotification(message) {
    let notification = document.getElementById('serverNotification');
    if (!notification) {
        notification = document.createElement('div');
        notification.id = 'serverNotification';
        notification.style.position = 'fixed';
        notification.style.top = '10px';
        notification.style.right = '10px';
        notification.style.backgroundColor = '#4caf50';
        notification.style.color = 'white';
        notification.style.padding = '10px';
        notification.style.borderRadius = '5px';
        notification.style.zIndex = '1000';
        document.body.appendChild(notification);
    }

    notification.textContent = message;
    setTimeout(() => notification.remove(), 4000);
}

// Periodically fetch new quotes from server every 30 seconds
setInterval(fetchQuotesFromServer, 30000);

// Optional: fetch once when page loads
fetchQuotesFromServer();