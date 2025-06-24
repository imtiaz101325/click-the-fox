import { useState, useRef, useCallback } from "react";

import Button from "../components/Button";
import { LOCAL_STORAGE_KEYS } from "../constants";

export default function WelcomeScreen({ handlePlay }) {
  const [name, setName] = useState("");
  const [inputVisible, setInputVisible] = useState(true);
  const timerRef = useRef(null);

  // Throttle function to limit the frequency of name updates
  const throttleInput = useCallback((e) => {
    const value = e.target.value;
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    timerRef.current = setTimeout(() => {
      setName(value);
      if (value.trim()) {
        setInputVisible(false);
      }
    }, 800);
  }, []);

  const handleName = useCallback((value) => {
    // Cancel the throttled update if it exists
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    setName(value);
    setInputVisible(false);
  }, []);

  const setNameOnEnter = useCallback(
    (event) => {
      if (event.key === "Enter") {
        handleName(event.target.value);
      }
    },
    [handleName]
  );

  const setNameOnBlur = useCallback(
    (event) => {
      handleName(event.target.value);
    },
    [handleName]
  );

  const handleEditName = () => {
    setInputVisible(true);
  };

  const gameStart = () => {
    localStorage.setItem(LOCAL_STORAGE_KEYS.PLAYER_NAME, name);
    handlePlay();
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <p className="mt-4 text-xl text-zinc-800">
        Welcome to the game! Click on the fox to score points.
      </p>

      {inputVisible && (
        <p className="mt-4 text-xl text-zinc-800">Please Enter Your Name:</p>
      )}

      {inputVisible ? (
        <div className="flex flex-col items-center">
          <input
            type="text"
            className="mt-2 p-2 border border-amber-400 rounded"
            defaultValue={name}
            onChange={throttleInput}
            onKeyDown={setNameOnEnter}
            onBlur={setNameOnBlur}
            placeholder="Ready Player One"
          />
        </div>
      ) : (
        <div className="flex items-center mt-4">
          <p
            className="text-xl font-medium text-zinc-800"
            onClick={handleEditName}
          >
            Player:{" "}
            <span className="border-b border-dotted border-amber-500 cursor-pointer text-2xl">
              {name}
            </span>
          </p>
          <button
            onClick={handleEditName}
            className="ml-2 text-amber-500 hover:text-amber-600 cursor-pointer"
            aria-label="Edit name"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
            </svg>
          </button>
        </div>
      )}

      <Button onClick={gameStart} disabled={!name}>
        PLAY!
      </Button>
    </div>
  );
}
