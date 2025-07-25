import { useCallback, useEffect, useRef, useState } from "react";
import { ANIMAL_TYPES, LOCAL_STORAGE_KEYS } from "../constants";

const GAME_DURATION = 30; // seconds
const WARNING_TIME = 5; // seconds

export default function PlayScreen({ generateImageGrid, handleScoreboard }) {
  const [imageGrid, setImageGrid] = useState([]);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timer);
          return 0; // Stop the timer when it reaches 0
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (timeLeft === 0) {
      const playerName = localStorage.getItem(LOCAL_STORAGE_KEYS.PLAYER_NAME);
      const history =
        JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEYS.HISTORY)) || [];

      history.push({
        name: playerName,
        score: score,
        time: new Date(),
      });
      history.sort((a, b) => b.score - a.score);

      localStorage.setItem(
        LOCAL_STORAGE_KEYS.HISTORY,
        JSON.stringify(history.slice(0, 10))
      );

      handleScoreboard();
    }
  }, [handleScoreboard, score, timeLeft]);

  const makeFreshImageGrid = useCallback(() => {
    setLoading(true);

    generateImageGrid().then((imageObjects) => {
      setLoading(false);
      setImageGrid(imageObjects);
      console.log("🚀 ~ fetchImages ~ images:", imageObjects);
    });
  }, [generateImageGrid]);

  const isInitiatedRef = useRef(false);
  useEffect(() => {
    if (!isInitiatedRef.current) {
      makeFreshImageGrid();
      isInitiatedRef.current = true;
    }
  }, [makeFreshImageGrid]);

  const calculateScoreAndReplaceImage = useCallback(
    (index) => {
      if (imageGrid[index].type === ANIMAL_TYPES.FOX) {
        setScore((prevScore) => prevScore + 1);
      } else {
        setScore((prevScore) => Math.max(prevScore - 1, 0));
      }

      makeFreshImageGrid();
    },
    [makeFreshImageGrid, imageGrid]
  );

  return (
    <div className="w-full max-w-5xl px-4">
      <div className="flex flex-row justify-around items-center">
        <p className="mt-4 text-xl text-zinc-800">
          Score: <span className="font-bold text-2xl">{score}</span>
        </p>
        <p className="mt-4 text-xl text-zinc-800">
          Time Left:{" "}
          <span
            className={
              timeLeft <= WARNING_TIME
                ? "text-red-500 animate-pulse text-2xl"
                : "text-zinc-800 text-2xl"
            }
          >
            {timeLeft}
          </span>
        </p>
      </div>
      {loading ? (
        <div className="grid grid-cols-3 gap-6 mt-6 w-full">
          {new Array(9).fill(null).map((_, index) => (
            <div
              key={index}
              className="aspect-square w-full relative overflow-hidden rounded-lg shadow-lg border-2 border-gray-200 hover:border-blue-500 transition-all hover:transform hover:scale-105"
            >
              <div className="absolute inset-0 bg-gray-300 animate-pulse flex items-center justify-center">
                <div className="flex items-center justify-center h-full w-full">
                  <div className="animate-spin rounded-full h-[80%] w-[80%] border-t-2 border-blue-500"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-6 mt-6 w-full">
          {imageGrid.map((image, index) => (
            <div
              key={index}
              className="aspect-square w-full relative overflow-hidden rounded-lg shadow-lg border-2 border-gray-200 hover:border-blue-500 transition-all hover:transform hover:scale-105"
            >
              <img
                src={image.src}
                alt={image.alt}
                className="absolute inset-0 w-full h-full object-cover cursor-pointer"
                onClick={() => calculateScoreAndReplaceImage(index)}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
