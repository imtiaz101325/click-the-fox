import { useState } from "react";

import WelcomeScreen from "./Screens/WelcomeScreen";

import { SCREENS } from "./constants.js";

export default function App() {
  const [currentScreen, setCurrentScreen] = useState(SCREENS.WELCOME);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-stone-100">
      <div className="flex flex-col items-center">
        <h1 className="text-2xl font-bold mb-4 text-zinc-800">Click the Fox! Game</h1>
        {currentScreen === SCREENS.WELCOME && <WelcomeScreen />}
      </div>
    </div>
  );
}
