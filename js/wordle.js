const words = ["SKIER", "BOARD", "CHAIR", "LIFTY", "LODGE", "TRAIL", "GLOVE", "SNOWY", "SLOPE", "FROST", "CHILL", "GLADE", "PISTE", "SHRED", "GRABS", "CARVE", "JUMPS", "TRICK"];
const wordleAnswer = words[Math.floor(Math.random() * words.length)];
let wordleGuesses = 0;
let guesses = [];

document.getElementById("wordle-input").addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        const guess = event.target.value.toUpperCase();

        if (guess.length !== 5) {
            alert("Guess must be 5 letters!");
            return;
        }

        const board = document.getElementById("wordle-board");
        const row = document.createElement("div");
        row.classList.add("row");

        const answerLetterCount = {};
        for (const letter of wordleAnswer) {
            answerLetterCount[letter] = (answerLetterCount[letter] || 0) + 1;
        }

        const guessResult = Array(5).fill(null);

        for (let i = 0; i < 5; i++) {
            const box = document.createElement("div");
            box.classList.add("box");
            box.textContent = guess[i];

            if (guess[i] === wordleAnswer[i]) {
                box.classList.add("correct");
                guessResult[i] = 'correct';
                answerLetterCount[guess[i]]--;
            } else {
                guessResult[i] = 'incorrect';
            }

            row.appendChild(box);
        }

        for (let i = 0; i < 5; i++) {
            const box = row.children[i];

            if (guessResult[i] === 'incorrect' && wordleAnswer.includes(guess[i]) && answerLetterCount[guess[i]] > 0) {
                box.classList.add("wrong-position");
                guessResult[i] = 'wrong-position';
                answerLetterCount[guess[i]]--;
            } else if (guessResult[i] === 'incorrect') {
                box.classList.add("incorrect");
            }
        }

        board.appendChild(row);
        guesses.push(guess);
        wordleGuesses++;
        event.target.value = "";

        if (guess === wordleAnswer) {
            displayResult(true);
        } else if (wordleGuesses >= 6) {
            displayResult(false);
        }
    }
});

function displayResult(isWinner) {
    const resultMessage = document.getElementById("result-message");
    const guessesList = document.getElementById("guesses-list");
    const resultSection = document.getElementById("result");

    if (isWinner) {
        resultMessage.textContent = "Congratulations! You guessed it!";
    } else {
        resultMessage.textContent = "Game Over! The word was " + wordleAnswer;
    }

    guesses.forEach(guess => {
        const guessDiv = document.createElement("div");
        guessDiv.textContent = guess;
        guessesList.appendChild(guessDiv);
    });

    resultSection.style.display = "block";
    document.getElementById("input-row").style.display = "none";
}
