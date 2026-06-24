# Battleship

A browser-based Battleship game built for The Odin Project. The app lets a player battle against a computer opponent, with randomly placed fleets, turn-based attacks, game status updates, and a smarter computer player that targets adjacent squares after scoring a hit.

## Live Demo

[View live project](https://battleship-bsul24.netlify.app/)

## Features

- Play Battleship against a computer opponent
- Randomly place ships for both players
- Randomize the player's fleet before the game starts
- Attack the computer board by clicking grid cells
- Track hits, misses, turns, and game-over state
- Reveal all ship locations when the game ends
- Smart computer targeting:
  - Attacks randomly until it scores a hit
  - Queues adjacent coordinates after a hit
  - Avoids repeating attacks
- New Game reset flow
- Basic manual placement interface started
- Responsive, minimal UI styling
- Unit tests for core game logic

## Built With

- HTML
- CSS
- JavaScript
- Webpack
- Jest
- Babel
- ESLint
- Prettier

## What I Practiced

- Test-driven development with Jest
- Separating game logic from DOM rendering
- Working with JavaScript classes and modules
- Managing game state across multiple objects
- Using `Map` and `Set` for board coordinates and attack history
- Implementing turn-based control flow
- Rendering dynamic UI from application state
- Handling edge cases like duplicate attacks and game-over behavior
- Improving computer opponent behavior with a target queue

## Project Structure

```text
.
├── README.md
├── package-lock.json
├── package.json
├── babel.config.cjs
├── jest.config.cjs
├── webpack.common.js
├── webpack.dev.js
├── webpack.prod.js
└── src
    ├── index.js
    ├── styles.css
    ├── template.html
    ├── modules
    │   ├── Ship.js
    │   ├── Gameboard.js
    │   ├── Player.js
    │   ├── gameController.js
    │   └── domController.js
    └── __tests__
        ├── Ship.test.js
        ├── Gameboard.test.js
        ├── Player.test.js
        └── gameController.test.js
```

## Core Game Logic

The project is organized around a few main modules:

### `Ship`

Tracks each ship's length, number of hits, and whether it has been sunk.

### `Gameboard`

Handles ship placement, attack results, missed attacks, duplicate attacks, and board cell status.

### `Player`

Represents a human or computer player. The computer player tracks generated attacks and uses a target queue to choose smarter attacks after a hit.

### `GameController`

Coordinates the game flow, including starting a new game, switching turns, checking for winners, randomizing fleets, and blocking invalid actions.

### `domController`

Renders the boards, updates status messages, handles player clicks, and connects UI controls to the game controller.

## Smart Computer Targeting

The computer starts by choosing random unattacked coordinates. When it gets a hit, it adds the valid adjacent coordinates to a target queue. On later turns, it attacks from that queue before returning to random attacks.

This keeps the AI simple while making it noticeably more strategic than purely random guessing.

## Running Locally

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Run the test suite:

```bash
npm test
```

Run linting:

```bash
npm run lint
```

Create a production build:

```bash
npm run build
```

## Future Improvements

- Finish drag-and-drop manual ship placement
- Add visual placement previews for manual placement
- Improve computer AI to continue in a detected ship direction after multiple hits
- Add a two-player pass-device mode
- Add sound effects or subtle animations
- Improve accessibility for keyboard users

## Acknowledgements

This project was built as part of The Odin Project JavaScript curriculum.
