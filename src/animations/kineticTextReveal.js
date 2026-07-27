import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const defaults = {
  splitBy: 'words',
  direction: 'up',
  distance: 30,
  stagger: 0.04,
  blur: 6,
  duration: 0.8,
  ease: 'cubic-bezier(0.22, 1, 0.36, 1)',
};

function getOffset(direction, distance) {
  switch (direction) {
    case 'down': return { x: 0, y: -distance };
    case 'left': return { x: distance, y: 0 };
    case 'right': return { x: -distance, y: 0 };
    default: return { x: 0, y: distance };
  }
}

function splitText(text, splitBy) {
  if (splitBy === 'characters') {
    return Array.from(text).map((ch) => ({
      value: ch,
      isSpace: /\s/.test(ch),
    }));
  }
  return text.split(/(\s+)/).map((part) => ({
    value: part,
    isSpace: /^\s+$/.test(part) || part.length === 0,
  }));
}

export function initKineticTextReveal() {
  const targets = document.querySelectorAll('.kinetic-reveal');
  if (!targets.length) return;

  targets.forEach((el) => {
    let raw = el.textContent.trim();
    if (!raw) return;

    if (el.querySelector('br')) {
      const html = el.innerHTML.replace(/<br\s*\/?>/gi, '\n');
      const div = document.createElement('div');
      div.innerHTML = html;
      raw = div.textContent.trim();
    }

    const splitBy = el.dataset.splitBy || defaults.splitBy;
    const direction = el.dataset.direction || defaults.direction;
    const distance = parseFloat(el.dataset.distance) || defaults.distance;
    const stagger = parseFloat(el.dataset.stagger) || defaults.stagger;
    const blur = el.dataset.blur !== 'false' ? (parseFloat(el.dataset.blur) || defaults.blur) : 0;
    const duration = parseFloat(el.dataset.duration) || defaults.duration;

    const offset = getOffset(direction, distance);
    const segments = splitText(raw, splitBy);
    const fragment = document.createDocumentFragment();

    segments.forEach((seg) => {
      const wrapper = document.createElement('span');
      wrapper.className = 'kinetic-word';
      if (seg.isSpace) {
        wrapper.style.display = 'inline';
        wrapper.textContent = seg.value;
      } else {
        wrapper.style.display = 'inline-block';
        wrapper.style.whiteSpace = 'pre-wrap';
        const inner = document.createElement('span');
        inner.className = 'kinetic-inner';
        inner.textContent = seg.value;
        wrapper.appendChild(inner);
      }
      fragment.appendChild(wrapper);
    });

    el.innerHTML = '';
    el.appendChild(fragment);

    const innerTargets = el.querySelectorAll('.kinetic-inner');
    gsap.set(innerTargets, {
      opacity: 0,
      x: offset.x,
      y: offset.y,
      filter: blur ? `blur(${blur}px)` : 'blur(0px)',
      willChange: 'transform, opacity, filter',
    });

    ScrollTrigger.create({
      trigger: el,
      start: 'top 85%',
      once: true,
      onEnter: () => {
        gsap.to(innerTargets, {
          opacity: 1,
          x: 0,
          y: 0,
          filter: 'blur(0px)',
          duration,
          ease: defaults.ease,
          stagger,
          overwrite: 'auto',
        });
      },
    });
  });
}
