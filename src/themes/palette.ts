/**
 * Semantic colour tokens for the light and dark themes.
 *
 * - Indigo primary: blue reads as trustworthy and calm, fits a globe/atlas,
 *   and keeps continuity with the app's original purple.
 * - Green for "visited" (done, achieved) and amber for "wishlist"
 *   (anticipation, a gold star).
 * - No pure black or white backgrounds: off-white in light mode and a deep
 *   blue-black in dark mode reduce glare and halation.
 * - Every text pair meets WCAG AA (4.5:1) and every icon/graphic pair 3:1.
 *   __tests__/themes/palette.test.ts enforces this.
 */
export type Palette = {
  background: string;
  surface: string;
  /** Chips, inactive buttons, progress tracks. */
  surfaceMuted: string;
  text: string;
  secondaryText: string;
  placeholder: string;
  divider: string;
  primary: string;
  onPrimary: string;
  primaryContainer: string;
  onPrimaryContainer: string;
  visited: string;
  visitedContainer: string;
  onVisitedContainer: string;
  wishlist: string;
  wishlistContainer: string;
  onWishlistContainer: string;
  error: string;
  skeletonBone: string;
  skeletonHighlight: string;
  elevation: [string, string, string, string, string];
};

export const lightPalette: Palette = {
  background: '#F5F6FA',
  surface: '#FFFFFF',
  surfaceMuted: '#ECEEF5',
  text: '#1A1C24',
  secondaryText: '#5C6170',
  placeholder: '#6B7080',
  divider: '#E3E6EE',
  primary: '#4F46E5',
  onPrimary: '#FFFFFF',
  primaryContainer: '#E0E7FF',
  onPrimaryContainer: '#312E81',
  visited: '#059669',
  visitedContainer: '#D1FAE5',
  onVisitedContainer: '#065F46',
  wishlist: '#C2680A',
  wishlistContainer: '#FEF3C7',
  onWishlistContainer: '#92400E',
  error: '#DC2626',
  skeletonBone: '#E6E8F0',
  skeletonHighlight: '#F5F6FA',
  elevation: ['#FFFFFF', '#FFFFFF', '#FFFFFF', '#FFFFFF', '#FFFFFF'],
};

export const darkPalette: Palette = {
  background: '#0F1117',
  surface: '#181B24',
  surfaceMuted: '#252937',
  text: '#E7E9F0',
  secondaryText: '#A0A6B8',
  placeholder: '#8B91A3',
  divider: '#2A2F3D',
  primary: '#A5B4FC',
  onPrimary: '#1E1B4B',
  primaryContainer: '#312E81',
  onPrimaryContainer: '#E0E7FF',
  visited: '#34D399',
  visitedContainer: '#064E3B',
  onVisitedContainer: '#A7F3D0',
  wishlist: '#FBBF24',
  wishlistContainer: '#78350F',
  onWishlistContainer: '#FDE68A',
  error: '#F87171',
  skeletonBone: '#1F2330',
  skeletonHighlight: '#2A2F3D',
  // Lighter surfaces read as "closer" in dark mode.
  elevation: ['#181B24', '#1C2029', '#20242E', '#232834', '#262B38'],
};
