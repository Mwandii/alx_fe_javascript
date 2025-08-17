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