import { ANIMAL_TYPES } from "./constants";

const IMAGE_QUEUE_INTERVAL = 300; // milliseconds
const IMAGE_FETCH_TIMEOUT = 5000;
const IMAGE_LOAD_TIMEOUT = 10000;
const IMAGE_QUEUE_SIZE = 54; // maximum number of images in the queue

// Fallback image URLs in case API calls fail
const FALLBACK_IMAGES = {
  [ANIMAL_TYPES.CAT]: "https://cdn2.thecatapi.com/images/9j5.jpg",
  [ANIMAL_TYPES.FOX]: "https://randomfox.ca/images/41.jpg",
  [ANIMAL_TYPES.DOG]:
    "https://images.dog.ceo/breeds/retriever-chesapeake/n02099849_1349.jpg",
};

async function fetchAnimalImage(url, extractImageUrl, animalType, apiName) {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), IMAGE_FETCH_TIMEOUT);

    const response = await fetch(url, {
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`HTTP error from ${apiName}! Status: ${response.status}`);
    }

    const data = await response.json();

    // Extract image URL using the provided function
    const imageUrl = extractImageUrl(data);
    if (!imageUrl) {
      throw new Error(`Invalid data structure from ${apiName}`);
    }

    return imageUrl;
  } catch (error) {
    // Categorize errors for better debugging
    const errorType =
      error.name === "AbortError"
        ? "timeout"
        : error.message.includes("HTTP error")
        ? "API error"
        : "parsing error";

    console.error(
      `Error (${errorType}) fetching ${animalType} image from ${apiName}:`,
      error
    );
    return FALLBACK_IMAGES[animalType];
  }
}

// An image queue "factory" that manages a queue of images to be pre-loaded.
function setupImageQueue(fetchImageSrc) {
  const imageQueue = [];

  function addImage(src) {
    if (!src || imageQueue.some((item) => item.src === src)) return;

    const img = new Image();

    // Set a timeout for image loading
    const timeoutId = setTimeout(() => {
      console.warn(`Image load timeout: ${src}`);
      img.src = ""; // Cancel the image load
    }, IMAGE_LOAD_TIMEOUT);

    img.onload = () => {
      clearTimeout(timeoutId);
      imageQueue.push({ img, src });
    };

    img.onerror = (error) => {
      clearTimeout(timeoutId);
      console.error(`Failed to load image: ${src}`, error);
      // Don't add to queue if loading fails
    };

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
  setInterval(() => {
    if (fetchImageSrc && imageQueue.length <= IMAGE_QUEUE_SIZE) {
      fetchImageSrc().then((src) => {
        addImage(src);
      });
    }
  }, IMAGE_QUEUE_INTERVAL);

  return { getImage };
}

async function getCatImageSrc() {
  return fetchAnimalImage(
    "https://api.thecatapi.com/v1/images/search",
    (data) => (data && data[0] && data[0].url ? data[0].url : null),
    ANIMAL_TYPES.CAT,
    "Cat API"
  );
}

async function getFoxImageSrc() {
  return fetchAnimalImage(
    "https://randomfox.ca/floof/",
    (data) => (data && data.image ? data.image : null),
    ANIMAL_TYPES.FOX,
    "Fox API"
  );
}

async function getDogImageSrc() {
  return fetchAnimalImage(
    "https://dog.ceo/api/breeds/image/random",
    (data) => (data && data.message ? data.message : null),
    ANIMAL_TYPES.DOG,
    "Dog API"
  );
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

    // Ensure there's at least one fox in the grid
    if (!foxFound) {
      // Replace a random image with a fox
      const randomIndex = Math.floor(Math.random() * imageObjects.length);
      imageObjects[randomIndex] = {
        alt: `Fox image ${randomIndex}`,
        type: ANIMAL_TYPES.FOX,
      };
    }

    // fetch the images that are ideally pre-loaded in browser cache
    const imagePromises = imageObjects.map(async (image, index) => {
      try {
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
          default:
            throw new Error(`Unknown animal type: ${image.type}`);
        }
        return {
          src,
          alt: image.alt,
          type: image.type,
        };
      } catch (error) {
        console.error(`Failed to get image for grid position ${index}:`, error);
        // Return a fallback for this particular image
        return {
          src: FALLBACK_IMAGES[image.type],
          alt: image.alt,
          type: image.type,
        };
      }
    });

    return Promise.all(imagePromises);
  }

  return {
    generateImageGrid,
  };
}
