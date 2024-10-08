const wordGroups = {
    powder: ["Ski", "Skirt", "Room", "Keg"],
    apres: ["Beer", "Hot Cocoa", "Hot Tub", "Poutine"],
    drinking: ["Lodge", "Gondola", "Chairlift", "Bar"],
    ski_parts: ["Base", "Core", "Edge", "Topsheet"]
};

const wordCategories = {
    powder: ["Words That Follow Powder"],
    apres: ["Apres Ski"],
    drinking: ["Where UofC Ski and Board Members Might Drink"],
    ski_parts: ["Parts of a Ski"]
};

let words = Object.values(wordGroups).flat();
let shuffledWords = shuffleArray(words);

let selectedWords = [];
let correctGroups = [];
let groupColors = ['correct-group-1', 'correct-group-2', 'correct-group-3', 'correct-group-4'];

const MAX_GUESSES = 4;
let remainingGuesses = MAX_GUESSES;

const wordGrid = document.getElementById('word-grid');
const message = document.getElementById('message');
const submitButton = document.getElementById('submit-btn');
const resetButton = document.getElementById('reset-button');
const backToMenuButton = document.getElementById('back-to-menu-btn');
const guessDots = document.getElementById('guess-dots');
const container = document.querySelector('.container');

function renderWordGrid() {
    wordGrid.innerHTML = '';
    shuffledWords.forEach(word => {
        const wordBox = document.createElement('div');
        wordBox.classList.add('word-box');
        wordBox.textContent = word;
        wordBox.addEventListener('click', () => selectWord(word, wordBox));
        wordGrid.appendChild(wordBox);
    });
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function selectWord(word, wordBox) {
    if (wordBox.classList.contains('correct')) return;

    if (wordBox.classList.contains('selected')) {
        wordBox.classList.remove('selected');
        selectedWords = selectedWords.filter(item => item.word !== word);
    } else {
        if (selectedWords.length < 4) {
            wordBox.classList.add('selected');
            selectedWords.push({ word, element: wordBox });
        }
    }
}

function checkGroup() {
    const selectedWordTexts = selectedWords.map(item => item.word);
    let matchedGroup = null;
    let matchedGroupName = null;

    for (const groupName in wordGroups) {
        const group = wordGroups[groupName];
        if (group.every(word => selectedWordTexts.includes(word))) {
            matchedGroup = group;
            matchedGroupName = groupName;
            break;
        }
    }

    if (matchedGroup) {
        moveGroupToTop(matchedGroup, matchedGroupName);
        correctGroups.push(matchedGroup);
        reshuffleRemainingWords();
    } else {
        remainingGuesses--;
        updateGuessDots();
        message.textContent = `Incorrect guess! You have ${remainingGuesses} guesses left.`;

        if (remainingGuesses === 0) {
            showFailMessage();
        } else {
            selectedWords.forEach(item => item.element.classList.remove('selected'));
        }
    }

    selectedWords = [];

    if (correctGroups.length === 4) {
        showCongratulations();
    }
}

function moveGroupToTop(group, groupName) {
    const topDiv = document.createElement('div');
    topDiv.classList.add('group-container');

    const categoryDiv = document.createElement('div');
    categoryDiv.classList.add('category-title');
    categoryDiv.textContent = wordCategories[groupName][0];

    topDiv.appendChild(categoryDiv);

    const wordsContainer = document.createElement('div');
    wordsContainer.classList.add('words-container');

    const groupColorClass = groupColors[correctGroups.length];
    group.forEach(word => {
        const wordBox = document.createElement('div');
        wordBox.classList.add('word-box', 'correct', groupColorClass); 
        wordBox.textContent = word;
        wordsContainer.appendChild(wordBox);
    });

    topDiv.appendChild(wordsContainer);

    container.insertBefore(topDiv, wordGrid);
}

function reshuffleRemainingWords() {
    const remainingWords = words.filter(word => !correctGroups.flat().includes(word));
    shuffledWords = shuffleArray(remainingWords);
    renderWordGrid();
}

function showCongratulations() {
    message.textContent = "Congratulations! You found all the connections!";
    submitButton.style.display = 'none';
    resetButton.style.display = 'none';
    backToMenuButton.style.display = 'block';
}

function showFailMessage() {
    message.textContent = "Game Over! You've run out of guesses.";
    submitButton.style.display = 'none';
    resetButton.style.display = 'none';
    backToMenuButton.style.display = 'block';
}

function resetGame() {
    location.reload();
}

function handleSubmit() {
    message.textContent = "";
    if (selectedWords.length === 4) {
        checkGroup();
    } else {
        message.textContent = "Please select exactly 4 words.";
    }
}

function renderGuessDots() {
    guessDots.innerHTML = '';
    for (let i = 0; i < MAX_GUESSES; i++) {
        const dot = document.createElement('span');
        dot.classList.add('dot');
        guessDots.appendChild(dot);
    }
}

function updateGuessDots() {
    const dots = guessDots.children;
    for (let i = 0; i < MAX_GUESSES; i++) {
        if (i >= remainingGuesses) {
            dots[i].classList.add('used');
        }
    }
}

renderWordGrid();
renderGuessDots();

resetButton.addEventListener('click', resetGame);
submitButton.addEventListener('click', handleSubmit);
backToMenuButton.addEventListener('click', () => {
    window.location.href = 'index.html';
});
