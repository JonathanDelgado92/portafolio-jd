import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function initScrollReveal() {
  const targets = document.querySelectorAll('.scroll-reveal');
  if (!targets.length) return;

  targets.forEach((el) => {
    const text = el.textContent.trim();
    if (!text) return;

    el.style.whiteSpace = 'pre-wrap';

    const words = text.split(/(\s+)/);
    const wordSpans = [];

    el.innerHTML = '';
    words.forEach((word) => {
      const span = document.createElement('span');
      span.className = 'word';
      span.textContent = word;
      el.appendChild(span);
      wordSpans.push(span);
    });

    gsap.fromTo(
      el,
      { transformOrigin: '0% 50%', rotate: 3 },
      {
        ease: 'none',
        rotate: 0,
        scrollTrigger: {
          trigger: el,
          start: 'top bottom',
          end: 'bottom bottom',
          scrub: true,
        },
      }
    );

    gsap.fromTo(
      wordSpans,
      { opacity: 0.1, filter: 'blur(4px)', willChange: 'opacity, filter' },
      {
        ease: 'none',
        opacity: 1,
        filter: 'blur(0px)',
        stagger: 0.04,
        scrollTrigger: {
          trigger: el,
          start: 'top bottom-=20%',
          end: 'bottom bottom',
          scrub: true,
        },
      }
    );
  });
}
