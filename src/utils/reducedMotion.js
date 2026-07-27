export const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

export function shouldAnimate() {
  return !prefersReducedMotion.matches;
}

prefersReducedMotion.addEventListener('change', () => {
  if (prefersReducedMotion.matches) {
    document.body.classList.add('reduce-motion');
  } else {
    document.body.classList.remove('reduce-motion');
  }
});
