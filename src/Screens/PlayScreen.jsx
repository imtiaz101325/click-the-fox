import { useCallback, useEffect, useState } from "react";
import { ANIMAL_TYPES } from "../constants";

export default function PlayScreen({ getCatImage, getFoxImage, getDogImage }) {
  const [imageGrid, setImageGrid] = useState([]);
  const [score, setScore] = useState(0);

  const getRandomAnimalImageObject = useCallback(
    (index) => {
      let image;
      const randomRoundNumber = Math.floor(Math.random() * 100);
      if (randomRoundNumber % 3 === 0) {
        image = {
          src: getCatImage(),
          alt: `Cat image ${index}`,
          type: ANIMAL_TYPES.CAT,
        };
      } else if (randomRoundNumber % 3 === 1) {
        image = {
          src: getFoxImage(),
          alt: `Fox image ${index}`,
          type: ANIMAL_TYPES.FOX,
        };
      } else {
        image = {
          src: getDogImage(),
          alt: `Dog image ${index}`,
          type: ANIMAL_TYPES.DOG,
        };
      }
      return image;
    },
    [getCatImage, getFoxImage, getDogImage]
  );

  useEffect(() => {
    const images = [];
    for (let i = 0; i < 9; i++) {
      images.push(getRandomAnimalImageObject(i));
    }
    setImageGrid(images);
    console.log("🚀 ~ fetchImages ~ images:", images);

    // Cleanup function to reset the grid when the component unmounts
  }, [getRandomAnimalImageObject]);


  const calculateScoreAndReplaceImage = useCallback((index) => {
    if (imageGrid[index].type === ANIMAL_TYPES.FOX) {
      setScore((prevScore) => prevScore + 1);
    } else {
      setScore((prevScore) => Math.max(prevScore - 1, 0));
    }

    const newImage = getRandomAnimalImageObject();
    setImageGrid((prevGrid) => {
      const newGrid = [...prevGrid];
      newGrid[index] = newImage;
      return newGrid;
    });
  }, [getRandomAnimalImageObject, imageGrid]);

  return (
    <div className="w-full max-w-5xl px-4">
      <div className="flex flex-col items-center">
        <p className="mt-4 text-lg text-zinc-800">Score: <span className="font-bold">{score}</span></p>
        <p className="mt-4 text-lg text-zinc-800">Time Left: xxx</p>
      </div>
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
    </div>
  );
}
