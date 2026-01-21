import DefaultJson, { Json } from '../src';

describe('export', () => {
  it('should default object be exported', () => {
    expect(typeof DefaultJson).toBe('object');
  });

  it('should named object be exported', () => {
    expect(typeof Json).toBe('object');
  });

  it('should named and default objects be equal', () => {
    expect(DefaultJson).toEqual(Json);
  });
});
