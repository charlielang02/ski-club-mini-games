const crosswordData = [
    ["G", "L", "A", "D", "E"],
    ["R", "I", "D", "E", null],
    ["A", "V", "I", "A", "N"],
    ["B", "E", "E", "R", null],
    [null, "R", "U", "S", "T"]
];

// Hardcoded number locations for clues
const numberLocations = [
    { row: 0, col: 0, number: 1 },  // "G" - 1 across and 1 down
    { row: 1, col: 0, number: 2 },  // "R" - 2 across (start of row 2)
    { row: 2, col: 0, number: 3 },  // "A" - 3 across (start of row 3)
    { row: 3, col: 0, number: 4 },  // "B" - 4 across (start of row 4)
    { row: 4, col: 1, number: 5 },  // "R" - 5 across (start of row 5)
    { row: 0, col: 1, number: 2 },  // "L" - 2 down (second column)
    { row: 0, col: 2, number: 3 },  // "A" - 3 down (third column)
    { row: 0, col: 3, number: 4 },  // "D" - 4 down (fourth column)
];

const acrossClues = [
    "1 Across: A small stream",
    "2 Across: To travel on water",
    "3 Across: A bird known for its ability to fly",
    "4 Across: A type of beverage made from fermented grains",
    "5 Across: A type of corrosion",
];

const downClues = [
    "2 Down: The second letter in the alphabet",
    "3 Down: To come into contact with water",
    "4 Down: A common noun referring to a growth or increase",
];



let isAcross = true;     // Tracks if the current focus is on an across word or a down word
let currentCell = null;  // Tracks the current focused cell
let focusedWord = [];    // Tracks the current word being worked on

const crosswordContainer = document.getElementById('crossword');
const messageContainer = document.getElementById('message');

function getWordFromCell(rowIndex, colIndex, isAcross) {
    let wordCells = [];
    if (isAcross) {
        for (let col = colIndex; col < crosswordData[rowIndex].length && crosswordData[rowIndex][col] !== null; col++) {
            wordCells.push({ row: rowIndex, col });
        }
    } else {
        for (let row = rowIndex; row < crosswordData.length && crosswordData[row][colIndex] !== null; row++) {
            wordCells.push({ row, col: colIndex });
        }
    }
    return wordCells;
}

function highlightWord(wordCells, currentCell) {
    clearHighlights();
    wordCells.forEach(({ row, col }) => {
        const input = document.querySelector(`input[data-row="${row}"][data-col="${col}"]`);
        input.parentElement.classList.add('highlight');  // Highlight the word in blue
        if (row === currentCell.row && col === currentCell.col) {
            input.parentElement.classList.add('active-cell');  // Highlight active cell in yellow
        }
    });
}

function clearHighlights() {
    document.querySelectorAll('.cell-wrapper').forEach(cell => {
        cell.classList.remove('highlight', 'active-cell');
    });
}

function createCrossword() {
    crosswordData.forEach((row, rowIndex) => {
        row.forEach((cell, colIndex) => {
            const cellElement = document.createElement('div');
            const inputElement = document.createElement('input');
            inputElement.classList.add('cell');
            inputElement.setAttribute('data-row', rowIndex);
            inputElement.setAttribute('data-col', colIndex);

            if (cell === null) {
                inputElement.classList.add('black');
                inputElement.setAttribute('disabled', 'true');
            } else {
                inputElement.maxLength = 1;
                inputElement.addEventListener('input', handleInput);
                inputElement.addEventListener('keydown', handleKeyNavigation);

                const numberedCell = numberLocations.find(numCell => numCell.row === rowIndex && numCell.col === colIndex);
                if (numberedCell) {
                    const numberElement = document.createElement('span');
                    numberElement.classList.add('number');
                    numberElement.textContent = numberedCell.number;
                    cellElement.appendChild(numberElement);
                }
            }

            cellElement.appendChild(inputElement);
            crosswordContainer.appendChild(cellElement);
            cellElement.style.gridColumnStart = colIndex + 1;
            cellElement.style.gridRowStart = rowIndex + 1;
            cellElement.classList.add('cell-wrapper');
        });
    });
}

function handleInput(event) {
    const input = event.target;
    input.value = input.value.toUpperCase();

    const row = parseInt(input.getAttribute('data-row'));
    const col = parseInt(input.getAttribute('data-col'));

    const wordCells = getWordFromCell(row, col, isAcross);
    const currentIndex = wordCells.findIndex(cell => cell.row === row && cell.col === col);
    if (currentIndex < wordCells.length - 1) {
        const nextCell = wordCells[currentIndex + 1];
        document.querySelector(`input[data-row="${nextCell.row}"][data-col="${nextCell.col}"]`).focus();
    }

    checkSolution();
}

function handleKeyNavigation(event) {
    const input = event.target;
    const row = parseInt(input.getAttribute('data-row'));
    const col = parseInt(input.getAttribute('data-col'));
    const wordCells = getWordFromCell(row, col, isAcross);
    const currentIndex = wordCells.findIndex(cell => cell.row === row && cell.col === col);

    switch (event.key) {
        case 'ArrowRight':
            if (isAcross) {
                if (currentIndex < wordCells.length - 1) {
                    const nextCell = wordCells[currentIndex + 1];
                    document.querySelector(`input[data-row="${nextCell.row}"][data-col="${nextCell.col}"]`).focus();
                }
            } else {
                isAcross = true;
                focusedWord = getWordFromCell(row, col, isAcross);
                highlightWord(focusedWord, { row, col });
            }
            event.preventDefault();
            break;
        case 'ArrowLeft':
            if (isAcross && currentIndex > 0) {
                const prevCell = wordCells[currentIndex - 1];
                document.querySelector(`input[data-row="${prevCell.row}"][data-col="${prevCell.col}"]`).focus();
            } else {
                isAcross = true;
                focusedWord = getWordFromCell(row, col, isAcross);
                highlightWord(focusedWord, { row, col });
            }
            event.preventDefault();
            break;
        case 'ArrowDown':
            if (!isAcross) {
                if (currentIndex < wordCells.length - 1) {
                    const nextCell = wordCells[currentIndex + 1];
                    document.querySelector(`input[data-row="${nextCell.row}"][data-col="${nextCell.col}"]`).focus();
                }
            } else {
                isAcross = false;
                focusedWord = getWordFromCell(row, col, isAcross);
                highlightWord(focusedWord, { row, col });
            }
            event.preventDefault();
            break;
        case 'ArrowUp':
            if (!isAcross && currentIndex > 0) {
                const prevCell = wordCells[currentIndex - 1];
                document.querySelector(`input[data-row="${prevCell.row}"][data-col="${prevCell.col}"]`).focus();
            } else {
                isAcross = false;
                focusedWord = getWordFromCell(row, col, isAcross);
                highlightWord(focusedWord, { row, col });
            }
            event.preventDefault();
            break;
    }
}

function displayClues() {
    const acrossContainer = document.getElementById('acrossClues');
    const downContainer = document.getElementById('downClues');

    acrossClues.forEach(clue => {
        const clueElement = document.createElement('div');
        clueElement.innerHTML = clue.replace(/(\d+)/, '<strong>$1</strong>'); // Make the clue number bold
        acrossContainer.appendChild(clueElement);
    });

    downClues.forEach(clue => {
        const clueElement = document.createElement('div');
        clueElement.innerHTML = clue.replace(/(\d+)/, '<strong>$1</strong>'); // Make the clue number bold
        downContainer.appendChild(clueElement);
    });
}


function checkSolution() {
    const inputs = document.querySelectorAll('.cell');
    let solved = true;
    let index = 0;

    for (let row of crosswordData) {
        for (let cell of row) {
            if (cell !== null) {
                if (inputs[index].value.toUpperCase() !== cell) {
                    solved = false;
                }
            }
            index++;
        }
    }

    if (solved) {
        messageContainer.textContent = "Congratulations! You've solved the crossword!";
        inputs.forEach(input => {
            input.setAttribute('disabled', 'true');
        });
        document.getElementById('clueContainer').style.display = 'none';
        document.getElementById('finishContainer').style.display = 'block';
    } else {
        messageContainer.textContent = "";
    }
}

createCrossword();
displayClues();