import { http, HttpResponse } from 'msw';
import { ANIMAL_TYPES } from '../../src/constants';

const MOCK_IMAGES = {
  [ANIMAL_TYPES.CAT]: [
    'https://mock-cat-api.com/image1.jpg',
    'https://mock-cat-api.com/image2.jpg',
    'https://mock-cat-api.com/image3.jpg',
  ],
  [ANIMAL_TYPES.FOX]: [
    'https://mock-fox-api.com/image1.jpg',
    'https://mock-fox-api.com/image2.jpg',
    'https://mock-fox-api.com/image3.jpg',
  ],
  [ANIMAL_TYPES.DOG]: [
    'https://mock-dog-api.com/image1.jpg',
    'https://mock-dog-api.com/image2.jpg',
    'https://mock-dog-api.com/image3.jpg',
  ],
};

const getRandomImage = (animalType) => {
  const images = MOCK_IMAGES[animalType];
  const index = Math.floor(Math.random() * images.length);
  return images[index];
};

export const handlers = [
  http.get('https://api.thecatapi.com/v1/images/search', () => {
    return HttpResponse.json([
      {
        url: getRandomImage(ANIMAL_TYPES.CAT),
        id: 'mock-cat-id',
        width: 500,
        height: 500,
      }
    ]);
  }),

  http.get('https://randomfox.ca/floof/', () => {
    return HttpResponse.json({
      image: getRandomImage(ANIMAL_TYPES.FOX),
      link: 'https://randomfox.ca/?i=mock-fox-id',
    });
  }),

  http.get('https://dog.ceo/api/breeds/image/random', () => {
    return HttpResponse.json({
      message: getRandomImage(ANIMAL_TYPES.DOG),
      status: 'success',
    });
  }),
];

export const getFailedHandlers = () => [
  http.get('https://api.thecatapi.com/v1/images/search', () => {
    return HttpResponse.error();
  }),
  
  http.get('https://randomfox.ca/floof/', () => {
    return HttpResponse.error();
  }),
  
  http.get('https://dog.ceo/api/breeds/image/random', () => {
    return HttpResponse.error();
  }),
];
