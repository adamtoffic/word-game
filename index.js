// Game state and configuration
let virtualKeyboardCreated = false;

const gameState = {
    currentWord: '',
    currentRow: 0,
    currentInput: 0,
    gameStats: {
        gamesPlayed: 0,
        gamesWon: 0,
        currentStreak: 0,
        maxStreak: 0
    }
};

// Main game functions
async function initializeGame() {
    showLoadingMessage('Loading new word...');

    const word = await getWord();
    hideLoadingMessage();

    if (word) {
        gameState.currentWord = word.toLowerCase();
        setupEventListeners();
        setupMobileEnhancements();
        loadStats();
        updateAttemptDisplay();
    } else {
        showMessage('Failed to fetch word. Please try again.', 'error');
    }
}

function showMessage(text, type = 'info') {
    const messageEl = document.getElementById('game-message');
    messageEl.textContent = text;
    messageEl.className = `message ${type}`;

    const hideDelay = type === 'error' ? 5000 : 3000;

    setTimeout(() => {
        messageEl.textContent = '';
        messageEl.className = 'message';
    }, hideDelay);
}

function handleKeyDown(event) {
    if (!event.target.classList.contains('letter-input')) {
        if (event.ctrlKey || event.metaKey) {
            switch(event.key.toLowerCase()) {
                case 'r':
                    event.preventDefault();
                    resetGame();
                    break;
                case 's':
                    event.preventDefault();
                    shareResults();
                    break;
            }
        }
        return;
    }

    const currentInput = event.target;
    const currentRow = event.target.closest('.row');
    const rows = Array.from(document.querySelectorAll('.row'));
    const rowIndex = rows.indexOf(currentRow);

    if (rowIndex !== gameState.currentRow) {
        event.preventDefault();
        focusCurrentRow();
        return;
    }

    switch(event.key) {
        case 'Backspace':
            handleBackspace(currentInput);
            event.preventDefault();
            break;
        case 'Delete':
            handleDelete(currentInput);
            event.preventDefault();
            break;
        case 'Enter':
            handleEnterKey(currentInput);
            event.preventDefault();
            break;
        case 'ArrowLeft':
        case 'ArrowRight':
            handleArrowKeys(event, currentInput);
            event.preventDefault();
            break;
    }
}

function handleEnterKey(currentInput) {
    const row = currentInput.closest('.row');
    const word = getWordFromRow(row);

    if (word.length === 5) {
        validateWord(word);
    } else {
        showMessage('Please complete the word first', 'error');
    }
}

function getWordFromRow(rowElement) {
    const inputs = rowElement.querySelectorAll('.letter-input');
    let word = '';
    inputs.forEach(input => {
        word += input.value || '';
    });
    return word.toLowerCase();
}

function handleArrowKeys(event, currentInput) {
    if (event.key === 'ArrowLeft') {
        moveToPreviousInput(currentInput);
    } else if (event.key === 'ArrowRight') {
        moveToNextInput(currentInput);
    }
}

async function validateWord(word) {
    showLoadingMessage('Checking word...');

    const isValidWord = await verifyWord(word);
    hideLoadingMessage();

    if (!isValidWord) {
        showMessage('Not a valid word!', 'error');
        return;
    }

    const actualWord = gameState.currentWord;
    const guessedWord = word.toLowerCase();
    let frequency = {};
    let result = ['red', 'red', 'red', 'red', 'red'];
    let used = [false, false, false, false, false];

    for (let letter of actualWord) {
        frequency[letter] = (frequency[letter] || 0) + 1;
    }

    for (let i = 0; i < 5; i++) {
        if (guessedWord[i] === actualWord[i]) {
            result[i] = 'green';
            frequency[guessedWord[i]]--;
            used[i] = true;
        }
    }

    for (let i = 0; i < 5; i++) {
        if (!used[i]) {
            const letter = guessedWord[i];
            if (actualWord.includes(letter) && frequency[letter] > 0) {
                result[i] = 'yellow';
                frequency[letter]--;
            }
        }
    }

    applyColorCodingWithAnimation(gameState.currentRow, result);

    if (word === gameState.currentWord) {
        showMessage('🎉 Congratulations! You won!', 'success');
        updateGameStats(true);
        updateStats();
        return;
    }

    gameState.currentRow++;
    updateAttemptDisplay();

    if (gameState.currentRow >= 6) {
        showMessage(`😞 Game over! The word was: ${gameState.currentWord.toUpperCase()}`, 'error');
        updateGameStats(false);
        updateStats();
    } else {
        focusNextRow();
    }
}

function applyColorCodingWithAnimation(rowIndex, results) {
    const rows = document.querySelectorAll('.row');
    const currentRow = rows[rowIndex];
    const inputs = currentRow.querySelectorAll('.letter-input');

    inputs.forEach((input, index) => {
        setTimeout(() => {
            input.classList.add('flip');
            setTimeout(() => {
                input.classList.add(results[index]);
                input.disabled = true;
            }, 300);
        }, index * 100);
    });
}

function setupMobileEnhancements() {
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

    if (isMobile) {
        addMobileKeyboard();
        addAutoSubmit();
    }
}

function addMobileKeyboard() {
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    const isSmallScreen = window.innerWidth <= 768;

    if (!isTouchDevice || !isSmallScreen) return;

    if (virtualKeyboardCreated) return;

    const keyboardContainer = document.createElement('div');
    keyboardContainer.className = 'mobile-keyboard';
    keyboardContainer.innerHTML = `
        <div class="keyboard-row">
            <button class="key">Q</button>
            <button class="key">W</button>
            <button class="key">E</button>
            <button class="key">R</button>
            <button class="key">T</button>
            <button class="key">Y</button>
            <button class="key">U</button>
            <button class="key">I</button>
            <button class="key">O</button>
            <button class="key">P</button>
        </div>
        <div class="keyboard-row">
            <button class="key">A</button>
            <button class="key">S</button>
            <button class="key">D</button>
            <button class="key">F</button>
            <button class="key">G</button>
            <button class="key">H</button>
            <button class="key">J</button>
            <button class="key">K</button>
            <button class="key">L</button>
        </div>
        <div class="keyboard-row">
            <button class="key special" data-key="enter">ENTER</button>
            <button class="key">Z</button>
            <button class="key">X</button>
            <button class="key">C</button>
            <button class="key">V</button>
            <button class="key">B</button>
            <button class="key">N</button>
            <button class="key">M</button>
            <button class="key special" data-key="backspace">⌫</button>
        </div>
    `;

    const statsContainer = document.querySelector('.stats-container');
    statsContainer.parentNode.insertBefore(keyboardContainer, statsContainer);

    keyboardContainer.addEventListener('click', handleVirtualKeyboard);
    virtualKeyboardCreated = true;
}

function handleVirtualKeyboard(event) {
    if (!event.target.classList.contains('key')) return;

    const key = event.target.textContent;
    const specialKey = event.target.dataset.key;

    if (specialKey === 'enter') {
        const currentRow = document.querySelectorAll('.row')[gameState.currentRow];
        const word = getWordFromRow(currentRow);
        if (word.length === 5) {
            validateWord(word);
        } else {
            showMessage('Please complete the word first', 'error');
        }
    } else if (specialKey === 'backspace') {
        const currentRow = document.querySelectorAll('.row')[gameState.currentRow];
        const inputs = currentRow.querySelectorAll('.letter-input:not([disabled])');

        for (let i = inputs.length - 1; i >= 0; i--) {
            if (inputs[i].value) {
                inputs[i].value = '';
                inputs[i].focus();
                break;
            }
        }
    } else {
        const currentRow = document.querySelectorAll('.row')[gameState.currentRow];
        const inputs = currentRow.querySelectorAll('.letter-input:not([disabled])');

        for (let input of inputs) {
            if (!input.value) {
                input.value = key;
                input.dataset.fromVirtualKeyboard = 'true';
                input.focus();
                input.dispatchEvent(new Event('input', { bubbles: true }));
                break;
            }
        }
    }
}

function addAutoSubmit() {
    document.addEventListener('input', (event) => {
        if (!event.target.classList.contains('letter-input')) return;

        if (event.target.dataset.fromVirtualKeyboard) {
            const currentRow = event.target.closest('.row');
            const word = getWordFromRow(currentRow);

            if (word.length === 5) {
                setTimeout(() => {
                    validateWord(word);
                }, 500);
            }
        }
    });
}

// ... Rest of your existing utility functions (unchanged)
function updateAttemptDisplay() {
    document.getElementById('current-attempt').textContent = gameState.currentRow + 1;
}

function updateStats() {
    const stats = gameState.gameStats;
    document.getElementById('games-played').textContent = stats.gamesPlayed;
    document.getElementById('win-rate').textContent =
        stats.gamesPlayed > 0 ? Math.round((stats.gamesWon / stats.gamesPlayed) * 100) + '%' : '0%';
    document.getElementById('current-streak').textContent = stats.currentStreak;
}

function revealAnswer() {
    showMessage(`The word was: ${gameState.currentWord.toUpperCase()}`, 'info');
    gameState.currentRow = 6;
    updateGameStats(false);
    updateStats();
}

function updateGameStats(won) {
    gameState.gameStats.gamesPlayed++;

    if (won) {
        gameState.gameStats.gamesWon++;
        gameState.gameStats.currentStreak++;
        gameState.gameStats.maxStreak = Math.max(
            gameState.gameStats.maxStreak,
            gameState.gameStats.currentStreak
        );
    } else {
        gameState.gameStats.currentStreak = 0;
    }

    saveStats();
}

function saveStats() {
    localStorage.setItem('wordGameStats', JSON.stringify(gameState.gameStats));
}

function loadStats() {
    const saved = localStorage.getItem('wordGameStats');
    if (saved) {
        gameState.gameStats = JSON.parse(saved);
        updateStats();
    }
}

function showLoadingMessage(text) {
    const messageEl = document.getElementById('game-message');
    messageEl.innerHTML = `<span class="loading">${text}</span>`;
    messageEl.className = 'message loading';
}

function hideLoadingMessage() {
    const messageEl = document.getElementById('game-message');
    messageEl.textContent = '';
    messageEl.className = 'message';
}

function setupEventListeners() {
    document.querySelector('.word-game').addEventListener('keydown', handleKeyDown);
    document.querySelector('.word-game').addEventListener('keyup', handleKeyUp);

    document.getElementById('reset-btn').addEventListener('click', resetGame);
    document.getElementById('reveal-btn').addEventListener('click', revealAnswer);
    document.getElementById('share-btn').addEventListener('click', shareResults);
}

function focusNextRow() {
    const rows = document.querySelectorAll('.row');
    if (gameState.currentRow < rows.length) {
        const nextRow = rows[gameState.currentRow];
        const firstInput = nextRow.querySelector('.letter-input');
        if (firstInput) firstInput.focus();
    }
}

function focusCurrentRow() {
    const rows = document.querySelectorAll('.row');
    const currentRow = rows[gameState.currentRow];
    const firstEmptyInput = currentRow.querySelector('.letter-input:not([disabled])');
    if (firstEmptyInput) firstEmptyInput.focus();
}

function moveToPreviousInput(currentInput) {
    const previousInput = currentInput.previousElementSibling;
    if (previousInput && !previousInput.disabled) {
        previousInput.focus();
    }
}

function resetGame() {
    document.querySelectorAll('.letter-input').forEach(input => {
        input.value = '';
        input.disabled = false;
        input.classList.remove('green', 'yellow', 'red', 'flip');
        delete input.dataset.fromVirtualKeyboard;
    });

    gameState.currentRow = 0;
    gameState.currentInput = 0;

    initializeGame();
    setTimeout(() => {
        document.querySelector('.letter-input').focus();
    }, 500);
}

function handleKeyUp(event) {
    if (!event.target.classList.contains('letter-input')) return;

    const currentInput = event.target;
    const input = currentInput.value;

    if (!isLetter(input)) {
        currentInput.value = '';
    }

    currentInput.value = input.toUpperCase();
    if (currentInput.value.length === 1 && !isNavigationKey(event.key)) {
        moveToNextInput(currentInput);
    }
}

function handleBackspace(currentInput) {
    if (currentInput.value !== '') {
        currentInput.value = '';
    } else {
        const previousInput = currentInput.previousElementSibling;
        if (previousInput) {
            previousInput.focus();
            previousInput.value = '';
        }
    }
}

function handleDelete(currentInput) {
    if (currentInput.value !== '') {
        currentInput.value = '';
    } else {
        const nextInput = currentInput.nextElementSibling;
        if (nextInput) {
            nextInput.value = '';
        }
    }
}

function moveToNextInput(currentInput) {
    const nextInput = currentInput.nextElementSibling;
    if (nextInput) nextInput.focus();
}

function isNavigationKey(key) {
    return ['Backspace', 'Delete', 'Enter', 'Tab', 'ArrowLeft', 'ArrowRight'].includes(key);
}

function isLetter(letter) {
    return /^[a-zA-Z]$/.test(letter);
}

function shareResults() {
    const won = gameState.currentRow <= 6 && document.querySelectorAll('.letter-input.green').length >= 5;
    const attempts = won ? gameState.currentRow : 'X';

    let result = `Word Game ${attempts}/6\n\n`;

    for (let i = 0; i < Math.min(gameState.currentRow, 6); i++) {
        const row = document.querySelectorAll('.row')[i];
        const inputs = row.querySelectorAll('.letter-input');

        inputs.forEach(input => {
            if (input.classList.contains('green')) result += '🟩';
            else if (input.classList.contains('yellow')) result += '🟨';
            else result += '⬛';
        });
        result += '\n';
    }

    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(result).then(() => {
            showMessage('Results copied to clipboard!', 'success');
        }).catch(() => {
            showMessage('Failed to copy results', 'error');
        });
    } else {
        showMessage(result, 'info');
    }
}

async function getWord() {
    const fallbackWords = ['HELLO', 'WORLD', 'GAMES', 'WORDS', 'CODED', 'MUSIC', 'LIGHT', 'SPACE'];

    try {
        const response = await fetch('https://words.dev-apis.com/word-of-the-day');

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data.word;
    } catch (error) {
        console.error('Failed to fetch word:', error.message);
        return fallbackWords[Math.floor(Math.random() * fallbackWords.length)];
    }
}

async function verifyWord(word) {
    try {
        const response = await fetch('https://words.dev-apis.com/validate-word', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ word })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data.validWord;
    } catch (error) {
        console.error('Failed to verify word:', error.message);
        return false;
    }
}

// Initialize the game
initializeGame();