const wordGroups = {
    ski: ["Ski", "Snow", "Powder", "Pole"],
    snowboard: ["Board", "Stomp", "Bind", "Terrain"],
    university: ["Dorm", "Lecture", "Grade", "Degree"],
    drinking: ["Beer", "Brew", "Shot", "Keg"]
};

let words = Object.values(wordGroups).flat();
let shuffledWords = shuffleArray(words);

let selectedWords = [];
let correctGroups = [];
let groupColors = ['correct-group-1', 'correct-group-2', 'correct-group-3', 'correct-group-4'];

const wordGrid = document.getElementById('word-grid');
const message = document.getElementById('message');
const submitButton = document.getElementById('submit-btn');
const resetButton = document.getElementById('reset-button');
const backToMenuButton = document.getElementById('back-to-menu-btn');

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
    return array.sort(() => Math.random() - 0.5);
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
    for (const groupName in wordGroups) {
        const group = wordGroups[groupName];
        if (group.every(word => selectedWordTexts.includes(word))) {
            matchedGroup = group;
            break;
        }
    }

    if (matchedGroup) {
        moveGroupToTop(matchedGroup);
        correctGroups.push(matchedGroup);
        reshuffleRemainingWords();
    } else {
        selectedWords.forEach(item => item.element.classList.remove('selected'));
    }

    selectedWords = [];

    if (correctGroups.length === 4) {
        showCongratulations();
    }
}

function moveGroupToTop(group) {
    const topDiv = document.createElement('div');
    topDiv.classList.add('grid');
    const groupColorClass = groupColors[correctGroups.length];
    group.forEach(word => {
        const wordBox = document.createElement('div');
        wordBox.classList.add('word-box', 'correct', groupColorClass);
        wordBox.textContent = word;
        topDiv.appendChild(wordBox);
    });
    document.body.insertBefore(topDiv, wordGrid);
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

function resetGame() {
    location.reload();
}

function handleSubmit() {
    if (selectedWords.length === 4) {
        checkGroup();
    } else {
        message.textContent = "Please select exactly 4 words.";
    }
}

renderWordGrid();

resetButton.addEventListener('click', resetGame);

submitButton.addEventListener('click', handleSubmit);

backToMenuButton.addEventListener('click', () => {
    window.location.href = 'index.html';
});
