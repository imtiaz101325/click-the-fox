import { useEffect, useState } from "react";

export default function PlayScreen({ getCatImage, getFoxImage, getDogImage }) {
  const [imageGrid, setImageGrid] = useState([]);

  useEffect(() => {
    const images = [];
    for (let i = 0; i < 9; i++) {
      let image;
      const randomRoundNumber = Math.floor(Math.random() * 100);
      if (randomRoundNumber % 3 === 0) {
        image = getCatImage();
      } else if (randomRoundNumber % 3 === 1) {
        image = getFoxImage();
      } else {
        image = getDogImage();
      }
      images.push(image);
    }
    setImageGrid(images);
    console.log("🚀 ~ fetchImages ~ images:", images);

    // Cleanup function to reset the grid when the component unmounts
    return () => {
      setImageGrid([]);
    };
  }, [getCatImage, getFoxImage, getDogImage]);

  return (
    <div className="w-full max-w-5xl px-4">
      <div className="flex flex-col items-center">
        <p className="mt-4 text-lg text-zinc-800">Score: xxx</p>
        <p className="mt-4 text-lg text-zinc-800">Time Left: xxx</p>
      </div>
      <div className="grid grid-cols-3 gap-6 mt-6 w-full">
        {imageGrid.map((image, index) => (
          <div
            key={index}
            className="aspect-square w-full relative overflow-hidden rounded-lg shadow-lg border-2 border-gray-200 hover:border-blue-500 transition-all hover:transform hover:scale-105"
          >
            <img
              src={image}
              alt={`Animal ${index}`}
              className="absolute inset-0 w-full h-full object-cover"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
