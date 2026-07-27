import { gsap } from 'gsap';

/**
 * Efecto "letter cascade" sobre los titulares.
 *
 * Port del componente React/framer-motion a GSAP: el proyecto es JS vanilla y
 * no usa React, así que se reproduce el comportamiento, no la API.
 *
 * Cada letra se duplica en dos caras superpuestas:
 *   - front: visible por defecto; al activarse gira hacia atrás y se desvanece.
 *   - echo:  oculta debajo; entra girando hasta quedar recta.
 * Ambas avanzan escalonadas y al terminar se reinicia el estado para poder
 * repetir. El muelle de framer-motion (stiffness 220 / damping 16) se aproxima
 * con un ease elástico de GSAP.
 */

const STAGGER = 0.04;
const DURATION = 0.55;
const EASE = 'elastic.out(1, 0.62)';
const BLUR = 4;
const SHIFT = 6;

/**
 * Envuelve cada carácter en su par front/echo.
 *
 * Se recorren los nodos hijos en vez de leer textContent para conservar los
 * <br> de los titulares, y cada palabra va en su propio contenedor para que la
 * línea no pueda partirse entre letras.
 */
function buildLetters(el) {
  const label = el.textContent.replace(/\s+/g, ' ').trim();
  if (!label) return null;

  const fronts = [];
  const echoes = [];

  const makeSlot = (ch) => {
    const slot = document.createElement('span');
    slot.className = 'cascade-slot';
    /* El nombre accesible ya lo da el aria-label del contenedor; sin esto un
       lector de pantalla leería cada letra dos veces (front y echo). */
    slot.setAttribute('aria-hidden', 'true');

    const front = document.createElement('span');
    front.className = 'cascade-front';
    front.textContent = ch;

    const echo = document.createElement('span');
    echo.className = 'cascade-echo';
    echo.textContent = ch;

    slot.append(front, echo);
    fronts.push(front);
    echoes.push(echo);
    return slot;
  };

  const frag = document.createDocumentFragment();

  for (const node of [...el.childNodes]) {
    if (node.nodeName === 'BR') {
      frag.appendChild(document.createElement('br'));
      continue;
    }
    if (node.nodeType !== Node.TEXT_NODE) {
      frag.appendChild(node.cloneNode(true));
      continue;
    }
    /* split conservando los separadores para no perder los espacios. */
    for (const part of node.textContent.split(/(\s+)/)) {
      if (!part) continue;
      if (/^\s+$/.test(part)) {
        frag.appendChild(document.createTextNode(' '));
        continue;
      }
      const word = document.createElement('span');
      word.className = 'cascade-word';
      for (const ch of part) word.appendChild(makeSlot(ch));
      frag.appendChild(word);
    }
  }

  if (!fronts.length) return null;

  el.setAttribute('aria-label', label);
  el.textContent = '';
  el.appendChild(frag);
  return { fronts, echoes };
}

function resetState(fronts, echoes) {
  gsap.set(fronts, { rotateX: 0, opacity: 1, y: 0, filter: 'blur(0px)' });
  gsap.set(echoes, { rotateX: -90, opacity: 0, y: SHIFT, scale: 0.8, filter: `blur(${BLUR}px)` });
}

export function initTextHover() {
  const targets = document.querySelectorAll('.hover-cascade');
  if (!targets.length) return;

  /* Sin puntero fino no hay hover que dispare el efecto. */
  if (window.matchMedia('(hover: none), (pointer: coarse)').matches) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  targets.forEach((el) => {
    const parts = buildLetters(el);
    if (!parts) return;

    const { fronts, echoes } = parts;
    let running = false;

    resetState(fronts, echoes);

    el.addEventListener('mouseenter', () => {
      if (running) return;
      running = true;

      const tl = gsap.timeline({
        onComplete: () => {
          resetState(fronts, echoes);
          running = false;
        },
      });

      tl.to(fronts, {
        rotateX: 90,
        opacity: 0,
        y: -SHIFT,
        filter: `blur(${BLUR}px)`,
        duration: DURATION,
        ease: EASE,
        stagger: STAGGER,
      }, 0);

      tl.to(echoes, {
        rotateX: 0,
        opacity: 1,
        y: 0,
        scale: 1,
        filter: 'blur(0px)',
        duration: DURATION,
        ease: EASE,
        stagger: STAGGER,
      }, 0);
    });
  });
}
