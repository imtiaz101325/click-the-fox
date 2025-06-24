import { ANIMAL_TYPES } from "./constants";

const IMAGE_QUEUE_INTERVAL = 300; // milliseconds
const IMAGE_QUEUE_SIZE = 54; // maximum number of images in the queue

// An image queue "factory" that manages a queue of images to be pre-loaded.
function setupImageQueue(fetchImageSrc) {
  const imageQueue = [];

  function addImage(src) {
    if (imageQueue.includes(src)) return;

    const img = new Image();

    img.onload = () => {
      imageQueue.push({img, src});
    }

    img.src = src;
  }

  async function getImage() {
    // Retry mechanism for slow internet connections
    if (imageQueue.length === 0) {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(getImage());
        }, IMAGE_QUEUE_INTERVAL * 2);
      });
    }

    return imageQueue.shift().src;
  }

  // start loading images
  const handel = setInterval(() => {
    if (fetchImageSrc && imageQueue.length <= IMAGE_QUEUE_SIZE) {
      fetchImageSrc().then((src) => {
        addImage(src);
      });
    }
  }, IMAGE_QUEUE_INTERVAL);

  function destroy() {
    imageQueue.length = 0;
    clearInterval(handel);
  }

  return { getImage, destroy };
}

async function getCatImageSrc() {
  const response = await fetch("https://api.thecatapi.com/v1/images/search");
  const data = await response.json();
  return data[0].url;
}

async function getFoxImageSrc() {
  const response = await fetch("https://randomfox.ca/floof/");
  const data = await response.json();
  return data.image;
}

async function getDogImageSrc() {
  const response = await fetch("https://dog.ceo/api/breeds/image/random");
  const data = await response.json();
  return data.message;
}

export default function setupImageFactory() {
  const catImageQueue = setupImageQueue(getCatImageSrc);
  const foxImageQueue = setupImageQueue(getFoxImageSrc);
  const dogImageQueue = setupImageQueue(getDogImageSrc);

  async function generateImageGrid() {
    // Generate a new grid of images with a mix of cats, dogs, and one fox
    const imageObjects = [];
    let foxFound = false;
    for (let i = 0; i < 9; i++) {
      let image;
      const randomRoundNumber = Math.floor(Math.random() * 100);
      if (randomRoundNumber % 3 === 0) {
        image = {
          alt: `Cat image ${i}`,
          type: ANIMAL_TYPES.CAT,
        };
      } else if (randomRoundNumber % 3 === 1 && !foxFound) {
        image = {
          alt: `Fox image ${i}`,
          type: ANIMAL_TYPES.FOX,
        };
        foxFound = true;
      } else {
        image = {
          alt: `Dog image ${i}`,
          type: ANIMAL_TYPES.DOG,
        };
      }

      imageObjects.push(image);
    }

    // fetch the images that are ideally pre-loaded in browser cache
    const imagePromises = imageObjects.map(async (image) => {
      let src;
      switch (image.type) {
        case ANIMAL_TYPES.CAT:
          src = await catImageQueue.getImage();
          break;
        case ANIMAL_TYPES.FOX:
          src = await foxImageQueue.getImage();
          break;
        case ANIMAL_TYPES.DOG:
          src = await dogImageQueue.getImage();
          break;
      }
      return {
        src,
        alt: image.alt,
        type: image.type,
      };
    });


    return Promise.all(imagePromises);
  }

  return {
    generateImageGrid
  };
}
