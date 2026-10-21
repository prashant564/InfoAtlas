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
    ['GUF', 'REU', 'SJM', 'BES', 'CXR', 'FRA', 'NOR', 'NLD', 'AUS'].forEach(
      id => {
        expect(shapeIds).toContain(id);
      },
    );
  });

  // The map uses Natural Earth's India point of view.
  test('follows the borders recognised by India', () => {
    // Not recognised as separate countries: drawn as part of Serbia and
    // Morocco, and tracked as dots.
    ['UNK', 'ESH'].forEach(id => {
      expect(shapeIds).not.toContain(id);
      expect(worldMap.points).toHaveProperty(id);
    });
    // Only specks such as Bir Tawil are left unassigned; Siachen and the
    // rest of Jammu & Kashmir belong to India.
    expect(worldMap.neutral.length).toBeLessThan(1000);
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
