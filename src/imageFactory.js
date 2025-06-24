const IMAGE_QUEUE_INTERVAL = 500; // milliseconds
const IMAGE_QUEUE_SIZE = 10; // maximum number of images in the queue

// An image queue "factory" that manages a queue of images to be pre-loaded.
function setupImageQueue(fetchImageSrc) {
  const imageQueue = [];

  function addImage(src) {
    const img = new Image();

    img.onload = () => {
      imageQueue.push(src);
    };
      console.log("🚀 ~ addImage ~ imageQueue:", imageQueue)

    img.src = src;
  }

  function getImage() {
    if (imageQueue.length === 0) {
      return null;
    }

    return imageQueue.shift();
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
    imageQueue.length = 0; // Clear the queue
    clearInterval(handel); // Stop the interval
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

  return {
    getCatImage: () => catImageQueue.getImage(),
    getFoxImage: () => foxImageQueue.getImage(),
    getDogImage: () => dogImageQueue.getImage(),
  };
}