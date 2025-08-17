let quotes = JSON.parse(localStorage.getItem("quotes")) || [
  { text: "With great power comes great responsibility", category: "motivation" },
  { text: "Surviving is winning Franklin...Everything else is bullshit", category: "humor" },
  { text: "As long as there are those who remember what was, there will always be those who cannot accept what can be", category: "wisdom" }
];


function createAddQuoteForm() {
    let div = document.createElement('div');
    let input1 = document.createElement('input');
    input1.setAttribute("id", "newQuoteText");
    input1.setAttribute("type", "text");
    input1.setAttribute("placeholder", "Enter a new quote");   

    let input2 = document.createElement('input');
    input2.setAttribute("id", "newQuoteCategory");
    input2.setAttribute("type", "text");
    input2.setAttribute("placeholder", "Enter quote category");

    let button = document.createElement("button");
    button.setAttribute("onclick", "addQuote()");
    button.textContent = "Add Quote";

    div.appendChild(input1);
    div.appendChild(input2);
    div.appendChild(button);

    document.body.appendChild(div);
}

createAddQuoteForm();

function addQuote() {
    let newQuoteText = document.getElementById('newQuoteText');
    let newQuoteCategory = document.getElementById('newQuoteCategory');

    quotes.push({text: newQuoteText.value.trim(), category: newQuoteCategory.value.trim()});
    localStorage.setItem("quotes", JSON.stringify(quotes));

    newQuoteText.value = '';
    newQuoteCategory.value = '';
}


function showRandomQuote() {
    let newQuotebtn = document.getElementById('newQuote');
    let quoteDisplay = document.getElementById('quoteDisplay');

    newQuotebtn.addEventListener('click', () => {
        let randomIndex = Math.floor(Math.random() * quotes.length);
        let randomQuote = quotes[randomIndex];
        quoteDisplay.innerHTML = '';

        let p = document.createElement('p');
        p.textContent = `${randomQuote.text} - ${randomQuote.category}`;

        quoteDisplay.appendChild(p);
    })
}

showRandomQuote();

function exportToJsonFile() {
    // Convert quotes array to a JSON string
    const jsonData = JSON.stringify(quotes, null, 2);

    // Create a Blob (like a file in memory)
    const blob = new Blob([jsonData], { type: "application/json" });

    // Create a temporary download link
    const url = URL.createObjectURL(blob);

    // Create <a> element for downloading
    const a = document.createElement("a");
    a.href = url;
    a.download = "quotes.json"; // file name
    a.click();

    // Free memory
    URL.revokeObjectURL(url);
}

function importFromJsonFile(event) {
    const fileReader = new FileReader(); // Create a FileReader to read the file

    // This runs after the file is fully read
    fileReader.onload = function(e) {
        try {
            // Convert JSON text into JavaScript array
            const importedQuotes = JSON.parse(e.target.result);

            // Merge imported quotes into existing quotes array
            quotes.push(...importedQuotes);

            // Save to localStorage so quotes persist
            localStorage.setItem("quotes", JSON.stringify(quotes));

            alert('Quotes imported successfully!');
        } catch (err) {
            alert('Error importing file: ' + err);
        }
    };

    // Start reading the selected file as text
    fileReader.readAsText(event.target.files[0]);
}