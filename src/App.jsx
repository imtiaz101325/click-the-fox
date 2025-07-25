import { useRef, useState } from "react";

import WelcomeScreen from "./Screens/WelcomeScreen";
import PlayScreen from "./Screens/PlayScreen";
import ScoreBoard from "./Screens/ScoreBoard";

import { SCREENS } from "./constants.js";
import setupImageFactory from "./imageFactory.js";

export default function App() {
  const [currentScreen, setCurrentScreen] = useState(SCREENS.WELCOME);

  const handlePlay = () => {
    setCurrentScreen(SCREENS.PLAY);
  };

  const handleScoreboard = () => {
    setCurrentScreen(SCREENS.SCOREBOARD);
  };

  const handleWelcome = () => {
    setCurrentScreen(SCREENS.WELCOME);
  };

  const imageFactoryRef = useRef(setupImageFactory());

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-stone-100 py-8">
      <div className="flex flex-col items-center w-full">
        <h1 className="text-3xl font-bold mb-4 text-zinc-800">
          Click the Fox! Game
        </h1>
        {currentScreen === SCREENS.WELCOME && (
          <WelcomeScreen handlePlay={handlePlay} />
        )}
        {currentScreen === SCREENS.PLAY && (
          <PlayScreen
            generateImageGrid={imageFactoryRef.current.generateImageGrid}
            handleScoreboard={handleScoreboard}
          />
        )}
        {currentScreen === SCREENS.SCOREBOARD && (
          <ScoreBoard
            handlePlay={handlePlay}
            handleWelcome={handleWelcome}
          />
        )}
      </div>
    </div>
  );
}
