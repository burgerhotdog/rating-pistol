import { vi, describe, it, expect } from 'vitest';
import { WEAPON_DICT, imageMatch, findBestMatch } from './ocr.helpers';

describe('dictionaries', () => {
  it('WEAPON_DICT exists', () => {
    //console.log(JSON.stringify(WEAPON_DICT, null, 2));
    expect(WEAPON_DICT).toBeDefined();
  });
});

describe('imageMatch', () => {
  it('returns 0 for identical arrays', () => {
    const arr = new Uint8ClampedArray([100, 100, 100, 255]);
    expect(imageMatch(arr, arr)).toBe(0);
  });
});

describe('findBestMatch', () => {
  it('finds the best match', () => {
    const arr = new Uint8ClampedArray([100, 100, 100, 255]);
    const templates = {
      a: new Uint8ClampedArray([100, 100, 100, 255]),
      b: new Uint8ClampedArray([200, 200, 200, 255])
    };
    expect(findBestMatch(arr, templates)).toBe('a');
  });
});

describe('regionToText', () => {
  it('should return the validated text for the given region', async () => {
    const region = { x: 1600, y: 450, w: 250, h: 30 };
    const dict = { 'TestWeapon': 'weapon_id_1' };
    const imageBitmap = {}; // Mock, not used in test logic

    // Mock cropBlob to avoid OffscreenCanvas
    vi.spyOn(require('./ocr.helpers'), 'cropBlob').mockResolvedValue('mockBlob');

    // Mock ocrWorker
    const ocrWorker = {
      recognize: vi.fn().mockResolvedValue({ data: { text: 'TestWeapon' } }),
    };

    // Mock snapToOption to just return the input text
    vi.spyOn(require('./ocr.helpers'), 'snapToOption').mockImplementation((text) => text);

    const result = await regionToText(region, dict, imageBitmap, ocrWorker);
    expect(result).toBe('TestWeapon');
    expect(ocrWorker.recognize).toHaveBeenCalled();
  });
});
