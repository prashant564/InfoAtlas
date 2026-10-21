import {Palette, darkPalette, lightPalette} from '@themes/palette';
import {Theme, parseThemeMode, resolveIsDark} from '@utils/ThemeContext';

const luminance = (hex: string) => {
  const [r, g, b] = hex
    .replace('#', '')
    .match(/../g)!
    .map(part => parseInt(part, 16) / 255)
    .map(v => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};

const contrast = (a: string, b: string) => {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
};

// WCAG AA: 4.5:1 for text, 3:1 for icons and other graphics.
const TEXT = 4.5;
const GRAPHIC = 3;

const pairs: [keyof Palette, keyof Palette, number][] = [
  ['text', 'background', TEXT],
  ['text', 'surface', TEXT],
  ['text', 'surfaceMuted', TEXT],
  ['secondaryText', 'background', TEXT],
  ['secondaryText', 'surface', TEXT],
  ['secondaryText', 'surfaceMuted', TEXT],
  ['placeholder', 'surface', TEXT],
  ['onPrimary', 'primary', TEXT],
  ['primary', 'surface', TEXT],
  ['primary', 'background', TEXT],
  ['onPrimaryContainer', 'primaryContainer', TEXT],
  ['onPrimaryContainer', 'surface', TEXT],
  ['onVisitedContainer', 'visitedContainer', TEXT],
  ['onWishlistContainer', 'wishlistContainer', TEXT],
  ['error', 'surface', TEXT],
  ['visited', 'surface', GRAPHIC],
  ['visited', 'surfaceMuted', GRAPHIC],
  ['wishlist', 'surface', GRAPHIC],
  ['wishlist', 'surfaceMuted', GRAPHIC],
  ['visited', 'mapLand', GRAPHIC],
  ['wishlist', 'mapLand', GRAPHIC],
  ['primary', 'mapLand', GRAPHIC],
];

describe.each([
  ['light', lightPalette],
  ['dark', darkPalette],
])('%s palette', (_name, palette) => {
  test.each(pairs)('%s on %s meets %s:1', (fg, bg, minimum) => {
    expect(
      contrast(palette[fg] as string, palette[bg] as string),
    ).toBeGreaterThanOrEqual(minimum);
  });
});

describe('theme mode', () => {
  test('defaults to System and keeps saved choices', () => {
    expect(parseThemeMode(null)).toBe(Theme.System);
    expect(parseThemeMode('garbage')).toBe(Theme.System);
    expect(parseThemeMode('Light')).toBe(Theme.Light);
    expect(parseThemeMode('Dark')).toBe(Theme.Dark);
  });

  test('System follows the OS, explicit choices override it', () => {
    expect(resolveIsDark(Theme.System, 'dark')).toBe(true);
    expect(resolveIsDark(Theme.System, 'light')).toBe(false);
    expect(resolveIsDark(Theme.System, null)).toBe(false);
    expect(resolveIsDark(Theme.Light, 'dark')).toBe(false);
    expect(resolveIsDark(Theme.Dark, 'light')).toBe(true);
  });
});
