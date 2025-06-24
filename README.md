# Click the Fox Game

## Overview

Click the Fox is a fun, fast-paced web game where players need to identify and click on fox images among other animals to score points. Players have 30 seconds to find as many foxes as possible while avoiding misclicks.

## Technologies Used

- React
- Vite
- Tailwind CSS
- Vitest for testing

## Project Structure

```text
src/
├── App.jsx                # Main application component
├── constants.js           # Game constants and enums
├── imageFactory.js        # Handles image generation and management
├── index.css              # Global styles
├── main.jsx               # Application entry point
├── components/            # Reusable UI components
│   └── Button.jsx         # Button component
└── Screens/               # Game screens
    ├── PlayScreen.jsx     # Main game screen
    ├── ScoreBoard.jsx     # Leaderboard screen
    └── WelcomeScreen.jsx  # Starting screen
```

## Installation

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Setup

1. Clone the repository

   ```bash
   git clone https://github.com/imtiaz101325/click-the-fox
   cd click-the-fox
   ```

2. Install dependencies

   ```bash
   npm install
   # or
   yarn
   ```

3. Start the development server

   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. Open your browser and navigate to `http://localhost:5173`

## Testing

Run the test suite with:

```bash
npm test
# or
yarn test
```
