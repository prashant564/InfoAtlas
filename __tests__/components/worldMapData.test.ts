import worldMap from '../../src/components/WorldMap/worldMap.json';
import {bundledDataset} from '@services/countries';

// Guards `yarn map:generate` output against the countries dataset.
describe('world map data', () => {
  const datasetCodes = new Set(bundledDataset.countries.map(c => c.cca3));
  const shapeIds = worldMap.shapes.map(shape => shape.id);
  const pointIds = Object.keys(worldMap.points);

  test('only references countries in the dataset', () => {
    [...shapeIds, ...pointIds].forEach(id => {
      expect(datasetCodes.has(id)).toBe(true);
    });
  });

  test('every country can be found on the map', () => {
    const onMap = new Set([...shapeIds, ...pointIds]);
    const missing = [...datasetCodes].filter(code => !onMap.has(code));
    expect(missing).toEqual([]);
  });

  test('has one shape per country', () => {
    expect(new Set(shapeIds).size).toBe(shapeIds.length);
  });

  test('keeps overseas regions separate from their parent', () => {
    ['GUF', 'REU', 'SJM', 'BES', 'FRA', 'NOR', 'NLD'].forEach(id => {
      expect(shapeIds).toContain(id);
    });
  });

  test('dots sit inside the map', () => {
    Object.values(worldMap.points).forEach(([x, y]) => {
      expect(x).toBeGreaterThanOrEqual(0);
      expect(x).toBeLessThanOrEqual(worldMap.width);
      expect(y).toBeGreaterThanOrEqual(0);
      expect(y).toBeLessThanOrEqual(worldMap.height);
    });
  });
});
