import { describe, it, expect, beforeEach, vi, beforeAll, afterAll } from 'vitest';
import { setupMockServer } from '../setup';
import { handlers } from '../mocks/animalApiHandlers';
import setupImageFactory from '../../src/imageFactory';
import { ANIMAL_TYPES } from '../../src/constants';

setupMockServer(handlers);

// Create a mock for the Image class to simulate browser behavior
class MockImage {
  constructor() {
    this.onload = null;
    this.onerror = null;
    this.src = '';
  }
  

  set src(url) {
    this._src = url;
    // Simulate successful image loading after a small delay
    if (url && this.onload) {
      setTimeout(() => {
        this.onload();
      }, 10);
    }
  }
  
  get src() {
    return this._src;
  }
}

describe('Image Factory Integration', () => {
  let originalImage;
  
  beforeAll(() => {
    originalImage = globalThis.Image;
    globalThis.Image = MockImage;
  });
  
  afterAll(() => {
    if (originalImage !== undefined) {
      globalThis.Image = originalImage;
    }
  });

  beforeEach(() => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.spyOn(console, 'warn').mockImplementation(() => {});
  });

  it('should generate a grid of 9 images with at least one fox', async () => {
    const imageFactory = setupImageFactory();
  
    const imageGrid = await imageFactory.generateImageGrid();
    
    expect(imageGrid).toHaveLength(9);
    
    // Check types and structure of images
    const animalCounts = {
      [ANIMAL_TYPES.CAT]: 0,
      [ANIMAL_TYPES.DOG]: 0,
      [ANIMAL_TYPES.FOX]: 0
    };
    
    imageGrid.forEach(image => {
      expect(image).toHaveProperty('src');
      expect(image).toHaveProperty('alt');
      expect(image).toHaveProperty('type');
      
      animalCounts[image.type]++;
    });

    expect(animalCounts[ANIMAL_TYPES.FOX]).toBeGreaterThanOrEqual(1);
    
    // Verify the total count is 9
    expect(animalCounts[ANIMAL_TYPES.CAT] + 
           animalCounts[ANIMAL_TYPES.DOG] + 
           animalCounts[ANIMAL_TYPES.FOX]).toBe(9);
  });
});
