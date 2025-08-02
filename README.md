# Word Game

A clean, interactive word guessing game built with vanilla JavaScript, HTML, and CSS. Similar to Wordle, players have 6 attempts to guess a 5-letter word with color-coded feedback.

## Screenshots

<p style="text-align: center;">
  <img src="screenshots/game-interface.png" width="300" alt="Game Interface">
  <img src="screenshots/game-won.png" width="300" alt="Game Won">
  <img src="screenshots/game-non-valid-word.png" width="300" alt="Game Non-Valid Word">
  <img src="screenshots/game-statistics.png" width="300" alt="Game Statistics">
</p>

## Features

- 🎯 6 attempts to guess the daily word
- 🎨 Color-coded feedback (Green: correct position, Yellow: wrong position, Gray: not in word)
- 📊 Game statistics tracking (games played, win rate, current streak)
- ⌨️ Keyboard shortcuts (Ctrl+R: new game, Ctrl+S: share results)
- 📱 Responsive design for mobile and desktop
- 🔄 Animated tile flips for better UX
- 📋 Share results functionality

## How to Play

1. Type a 5-letter word using your keyboard
2. Press Enter to submit your guess
3. Use the color feedback to guide your next guess:
   - 🟩 Green: Letter is correct and in the right position
   - 🟨 Yellow: Letter is in the word but wrong position
   - ⬛ Gray: Letter is not in the word
4. Guess the word within 6 attempts to win!

## Getting Started

### Prerequisites

- A modern web browser
- Internet connection (for fetching daily words)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/adamtoffic/word-game.git
   1. Navigate to the project directory:
   ```bash
   cd word-game
   ```
   2. Open `index.html` in your web browser or use a local server:
       Using Python
      ```bash
      python -m http.server 8000
      ```
      Using Node.js
      ```bash
      npx http-server (if you have http-server installed globally)
      ```npx http-server
      ```
3. Open your browser and go to `http://localhost:8000` or the port you specified.

## Technologies Used
- HTML5 - Structures and semantics
- CSS3 - Styling and animations
- JavaScript - Game logic and interactivity
- Local Storage - Saving game state and statistics
- Fetch API - Word validation and daily word retrieval

## API
This game uses the [Words Post API](https://https://words.dev-apis.com/validate-word/) to validate words and [Words Get API](https://https://words.dev-apis.com/word-of-the-day) to fetch the daily word. It was made by Frontend Masters.

## Contributing
Contributions are welcome! If you find a bug or have a feature request, please open an issue or submit a pull request.
   1. Fork the repository
   2. Create a feature branch:
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. Commit your changes:
   ```bash
   git commit -m "Add your feature description"
   ```
4. Push to the branch:
   ```bash
   git push origin feature/your-feature-name
   ```
   5. Open a pull request
   
## License
This project is licensed under the MIT License - see the [LICENSE](LICENSE.txt) file for details

## Acknowledgements
- Inspired by the popular game Wordle
- Thanks to the Frontend Masters team for the API and inspiration