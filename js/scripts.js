const wordleAnswer = "SKIER";  // hardcoded ski-related word
let wordleGuesses = 0;

document.getElementById("wordle-submit").addEventListener("click", () => {
    const guess = document.getElementById("wordle-input").value.toUpperCase();
    const board = document.getElementById("wordle-board");

    if (guess.length !== 5) return alert("Guess must be 5 letters!");

    const row = document.createElement("div");
    for (let i = 0; i < guess.length; i++) {
        const letter = document.createElement("span");
        letter.textContent = guess[i];
        if (guess[i] === wordleAnswer[i]) {
            letter.style.backgroundColor = "green";
        } else if (wordleAnswer.includes(guess[i])) {
            letter.style.backgroundColor = "yellow";
        } else {
            letter.style.backgroundColor = "gray";
        }
        row.appendChild(letter);
    }
    board.appendChild(row);
    wordleGuesses++;
    if (guess === wordleAnswer) alert("Congratulations! You guessed it!");
    else if (wordleGuesses >= 6) alert("Game Over! The word was " + wordleAnswer);
});

const connectionsTerms = ["Ski", "Snowboard", "Lift", "Goggles", "Helmet", "Bindings", "Park", "Powder"];
const connectionsAnswers = [
    ["Ski", "Snowboard", "Bindings", "Helmet"],
    ["Lift", "Park", "Powder", "Goggles"]
];
let selectedTerms = [];

const board = document.getElementById("connections-board");
connectionsTerms.forEach(term => {
    const termDiv = document.createElement("div");
    termDiv.textContent = term;
    termDiv.classList.add("term");
    termDiv.addEventListener("click", () => {
        termDiv.classList.toggle("selected");
        if (selectedTerms.includes(term)) {
            selectedTerms = selectedTerms.filter(t => t !== term);
        } else {
            selectedTerms.push(term);
        }
    });
    board.appendChild(termDiv);
});

document.getElementById("connections-submit").addEventListener("click", () => {
    let correct = 0;
    connectionsAnswers.forEach(group => {
        if (group.every(term => selectedTerms.includes(term))) correct++;
    });
    alert(`You found ${correct} correct groups!`);
});

const crosswordClues = {
    across: {
        1: "Winter Sport (4)",
        2: "Transportation up the mountain (4)",
    },
    down: {
        1: "What you wear on your head (6)",
        2: "Where ski clubs gather (6)",
    }
};

const crosswordGrid = [
    ["S", "K", "I", "S", ""],
    ["", "", "", "L", ""],
    ["H", "E", "L", "M", "E"],
    ["U", "N", "I", "V", "E"],
    ["", "", "", "", "S"]
];

const gridElement = document.getElementById("crossword-grid");
crosswordGrid.forEach(row => {
    row.forEach(cell => {
        const cellDiv = document.createElement("div");
        cellDiv.textContent = cell ? cell : "";
        cellDiv.classList.add("crossword-cell");
        gridElement.appendChild(cellDiv);
    });
});

const strandsItems = ["Powder", "Goggles", "Chairlift", "Bindings", "Park", "Helmet"];
const strandsConnections = {
    "Powder": "Park",
    "Goggles": "Helmet",
    "Chairlift": "Bindings"
};
let currentDragItem = null;

const strandsBoard = document.getElementById("strands-board");
strandsItems.forEach(item => {
    const itemDiv = document.createElement("div");
    itemDiv.textContent = item;
    itemDiv.setAttribute("draggable", "true");
    itemDiv.addEventListener("dragstart", () => {
        currentDragItem = item;
    });
    itemDiv.addEventListener("drop", () => {
        if (strandsConnections[currentDragItem] === item) {
            alert("Correct!");
        } else {
            alert("Try again!");
        }
    });
    itemDiv.addEventListener("dragover", (e) => e.preventDefault());
    strandsBoard.appendChild(itemDiv);
});
