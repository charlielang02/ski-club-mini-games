// Define the word groups
const wordGroups = {
    ski: ["Ski", "Snow", "Powder", "Pole"],
    snowboard: ["Board", "Stomp", "Bind", "Terrain"],
    university: ["Dorm", "Lecture", "Grade", "Degree"],
    drinking: ["Beer", "Brew", "Shot", "Keg"]
};

// Flatten all words into an array and shuffle them
let words = Object.values(wordGroups).flat();
let shuffledWords = shuffleArray(words);

// Track selected words and correct groups
let selectedWords = [];
let correctGroups = [];
let groupColors = ['correct-group-1', 'correct-group-2', 'correct-group-3', 'correct-group-4'];

// Elements for displaying the game
const wordGrid = document.getElementById('word-grid');
const message = document.getElementById('message');
const submitButton = document.getElementById('submit-btn');

// Render the initial grid of words
function renderWordGrid() {
    wordGrid.innerHTML = ''; // Clear existing grid
    shuffledWords.forEach(word => {
        const wordBox = document.createElement('div');
        wordBox.classList.add('word-box');
        wordBox.textContent = word;
        wordBox.addEventListener('click', () => selectWord(word, wordBox));
        wordGrid.appendChild(wordBox);
    });
}

// Shuffle array function
function shuffleArray(array) {
    return array.sort(() => Math.random() - 0.5);
}

// Select a word
function selectWord(word, wordBox) {
    if (wordBox.classList.contains('selected') || wordBox.classList.contains('correct')) return;

    wordBox.classList.add('selected');
    selectedWords.push({ word, element: wordBox });

    // Automatically limit selection to 4 words
    if (selectedWords.length > 4) {
        const lastSelected = selectedWords.pop();
        lastSelected.element.classList.remove('selected');
    }
}

// Check if the selected words form a valid group
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
        moveGroupToTop(matchedGroup); // Move the correct group to the top
        correctGroups.push(matchedGroup);
        reshuffleRemainingWords();    // Reshuffle the remaining words
    } else {
        selectedWords.forEach(item => item.element.classList.remove('selected'));
    }

    selectedWords = [];

    if (correctGroups.length === 4) {
        showCongratulations();
    }
}

// Move the correct group to the top
function moveGroupToTop(group) {
    const topDiv = document.createElement('div');
    topDiv.classList.add('grid');
    const groupColorClass = groupColors[correctGroups.length]; // Assign unique color class to the group

    group.forEach(word => {
        const wordBox = document.createElement('div');
        wordBox.classList.add('word-box', 'correct', groupColorClass);
        wordBox.textContent = word;
        topDiv.appendChild(wordBox);
    });
    document.body.insertBefore(topDiv, wordGrid); // Insert the group above the grid
}

// Reshuffle remaining words
function reshuffleRemainingWords() {
    const remainingWords = words.filter(word => !correctGroups.flat().includes(word));
    shuffledWords = shuffleArray(remainingWords);
    renderWordGrid(); // Re-render the grid with reshuffled words
}

// Show congratulations message
function showCongratulations() {
    message.textContent = "Congratulations! You found all the connections!";
}

// Reset the game
function resetGame() {
    location.reload(); // Reload the page to reset the game
}

// Handle submit button click
function handleSubmit() {
    if (selectedWords.length === 4) {
        checkGroup(); // Only check if exactly 4 words are selected
    } else {
        message.textContent = "Please select exactly 4 words.";
    }
}

// Initial render of the grid
renderWordGrid();

// Add event listener for reset button
document.getElementById('reset-button').addEventListener('click', resetGame);

// Add event listener for submit button
submitButton.addEventListener('click', handleSubmit);
