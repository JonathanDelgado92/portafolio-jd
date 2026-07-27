const breakpoints = {
  desktop: 1440,
  laptop: 1280,
  tablet: 1024,
  mobile: 768,
  small: 480,
};

export function isMobile() {
  return window.innerWidth <= breakpoints.mobile;
}

/**
 * Dispositivo táctil / sin puntero fino.
 *
 * Para efectos que dependen del ratón (cursor personalizado, tilt al pasar por
 * encima) esto es el criterio correcto, no el ancho: una ventana de escritorio
 * estrecha sigue teniendo ratón, y una tablet ancha sigue sin tenerlo.
 */
export function isTouch() {
  return window.matchMedia('(hover: none), (pointer: coarse)').matches;
}

export function isTablet() {
  return window.innerWidth > breakpoints.mobile && window.innerWidth <= breakpoints.tablet;
}

export function isDesktop() {
  return window.innerWidth > breakpoints.tablet;
}

export function getBreakpoint() {
  const w = window.innerWidth;
  if (w <= breakpoints.small) return 'small';
  if (w <= breakpoints.mobile) return 'mobile';
  if (w <= breakpoints.tablet) return 'tablet';
  if (w <= breakpoints.laptop) return 'laptop';
  return 'desktop';
}
