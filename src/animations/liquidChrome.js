import { rafWhenVisible } from '../utils/rafWhenVisible.js';

const vertexShaderSource = `
  attribute vec2 position;
  void main() {
    gl_Position = vec4(position, 0.0, 1.0);
  }
`;

const fragmentShaderSource = `
  precision highp float;

  uniform vec2 u_resolution;
  uniform float u_time;
  uniform vec2 u_mouse;
  uniform vec3 u_baseColor;
  uniform float u_amplitude;

  const mat2 m = mat2( 0.80,  0.60, -0.60,  0.80 );

  float hash( vec2 p ) {
      float h = dot(p,vec2(127.1,311.7));
      return fract(sin(h)*43758.5453123);
  }

  float noise( in vec2 p ) {
      vec2 i = floor( p );
      vec2 f = fract( p );
      vec2 u = f*f*(3.0-2.0*f);
      return mix( mix( hash( i + vec2(0.0,0.0) ),
                       hash( i + vec2(1.0,0.0) ), u.x),
                  mix( hash( i + vec2(0.0,1.0) ),
                       hash( i + vec2(1.0,1.0) ), u.x), u.y);
  }

  float fbm( vec2 p ) {
      float f = 0.0;
      f += 0.5000*noise( p ); p = m*p*2.02;
      f += 0.2500*noise( p ); p = m*p*2.03;
      f += 0.1250*noise( p ); p = m*p*2.01;
      f += 0.0625*noise( p );
      return f/0.9375;
  }

  void main() {
    vec2 uv = gl_FragCoord.xy / u_resolution.xy;
    vec2 p = -1.0 + 2.0 * uv;
    if (u_resolution.y > 0.0) {
        p.x *= u_resolution.x / u_resolution.y;
    }

    vec2 mouse = (u_mouse - 0.5) * 2.0;
    if (u_resolution.y > 0.0) {
        mouse.x *= u_resolution.x / u_resolution.y;
    }

    vec2 diff = p - mouse;
    float dist = length(diff);
    vec2 distortion = vec2(0.0);
    if (dist > 0.0) {
        distortion = (diff / dist) * exp(-dist * 3.0) * 0.1;
    }
    p += distortion;

    float time = u_time * 0.5;

    vec2 q = vec2(0.0);
    q.x = fbm(p + vec2(0.0, 0.0) + time * 0.1);
    q.y = fbm(p + vec2(5.2, 1.3) + time * 0.15);

    vec2 r = vec2(0.0);
    r.x = fbm(p + 4.0 * q + vec2(1.7, 9.2) + time * 0.2);
    r.y = fbm(p + 4.0 * q + vec2(8.3, 2.8) + time * 0.25);

    float f = fbm(p + r * 4.0 * u_amplitude);

    vec3 col = u_baseColor;

    float highlight = smoothstep(0.4, 0.6, f);
    float highlight2 = smoothstep(0.6, 0.8, f);
    float dark = smoothstep(0.1, 0.3, f);

    col = mix(col, vec3(0.0), 1.0 - dark);
    col = mix(col, vec3(0.8, 0.8, 0.9), highlight);
    col = mix(col, vec3(1.0, 1.0, 1.0), highlight2);

    float v = 16.0 * uv.x * uv.y * (1.0 - uv.x) * (1.0 - uv.y);
    col *= 0.5 + 0.5 * pow(max(0.0, v), 0.2);

    gl_FragColor = vec4(col, 1.0);
  }
`;

export function initLiquidChrome(canvas, opts = {}) {
  if (!canvas) return;

  const {
    baseColor = [0.15, 0.15, 0.15],
    speed = 0.8,
    amplitude = 0.6,
    interactive = true,
  } = opts;

  /* preserveDrawingBuffer es imprescindible con el tope de fotogramas: por
     defecto WebGL vacía el búfer tras componer, así que en los fotogramas
     que no se redibujan el fondo se compondría transparente y la sección se
     quedaba en negro. Conservándolo, un fotograma saltado sigue mostrando
     el último dibujo. */
  const gl = canvas.getContext('webgl', { preserveDrawingBuffer: true });
  if (!gl) return;

  function compileShader(source, type) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      console.error('Shader error:', gl.getShaderInfoLog(shader));
      return null;
    }
    return shader;
  }

  const vs = compileShader(vertexShaderSource, gl.VERTEX_SHADER);
  const fs = compileShader(fragmentShaderSource, gl.FRAGMENT_SHADER);
  if (!vs || !fs) return;

  const program = gl.createProgram();
  gl.attachShader(program, vs);
  gl.attachShader(program, fs);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error('Program link error:', gl.getProgramInfoLog(program));
    return;
  }
  gl.useProgram(program);

  const posBuf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, posBuf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]), gl.STATIC_DRAW);

  const posLoc = gl.getAttribLocation(program, 'position');
  gl.enableVertexAttribArray(posLoc);
  gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);

  const uRes = gl.getUniformLocation(program, 'u_resolution');
  const uTime = gl.getUniformLocation(program, 'u_time');
  const uMouse = gl.getUniformLocation(program, 'u_mouse');
  const uColor = gl.getUniformLocation(program, 'u_baseColor');
  const uAmp = gl.getUniformLocation(program, 'u_amplitude');

  let mouse = [0.5, 0.5];
  let startTime = performance.now();

  /**
   * Escala de render, deliberadamente por debajo de la densidad de pantalla.
   *
   * El shader hace cinco fbm por píxel, y cada uno acaba en dieciséis senos:
   * unos ochenta por píxel y fotograma. A densidad nativa, un móvil con DPR 3
   * tiene que resolver casi tres millones de píxeles sesenta veces por
   * segundo, y ahí es donde el scroll se atasca.
   *
   * Como el fondo es una nube difusa sin detalle fino, renderizar por debajo
   * y dejar que el navegador lo estire no se nota: se pierde nitidez que la
   * imagen nunca tuvo. Bajar de 3 a 1 recorta el trabajo nueve veces.
   */
  function escalaRender() {
    const dpr = window.devicePixelRatio || 1;
    const movil = window.matchMedia('(pointer: coarse)').matches;
    return Math.min(dpr, movil ? 1 : 1.5);
  }

  function resize() {
    const rect = canvas.getBoundingClientRect();
    const escala = escalaRender();
    canvas.width = Math.max(1, Math.round(rect.width * escala));
    canvas.height = Math.max(1, Math.round(rect.height * escala));
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.uniform2f(uRes, canvas.width, canvas.height);
  }

  function handleMouse(e) {
    if (!interactive) return;
    const rect = canvas.getBoundingClientRect();
    mouse[0] = (e.clientX - rect.left) / rect.width;
    mouse[1] = 1.0 - (e.clientY - rect.top) / rect.height;
  }

  function handleLeave() {
    if (!interactive) return;
    mouse = [0.5, 0.5];
  }

  window.addEventListener('resize', resize);
  canvas.addEventListener('mousemove', handleMouse);
  canvas.addEventListener('mouseleave', handleLeave);

  resize();

  /* Tope de fotogramas: el fondo se mueve muy despacio, así que a 30 se ve
     igual y se libera la mitad del trabajo de GPU justo mientras se hace
     scroll, que es cuando el navegador más lo necesita. */
  const MS_POR_FOTOGRAMA = 1000 / 30;
  let ultimoDibujo = 0;

  function render() {
    const ahora = performance.now();
    if (ahora - ultimoDibujo < MS_POR_FOTOGRAMA) return;
    ultimoDibujo = ahora;

    const elapsed = (ahora - startTime) * 0.001 * speed;
    gl.uniform1f(uTime, elapsed);
    gl.uniform2f(uMouse, mouse[0], mouse[1]);
    gl.uniform3f(uColor, baseColor[0], baseColor[1], baseColor[2]);
    gl.uniform1f(uAmp, amplitude);
    gl.drawArrays(gl.TRIANGLES, 0, 6);
  }

  /* El shader solo se dibuja con la sección de contacto en pantalla: antes
     corría siempre, incluso con el usuario en el hero. */
  const detener = rafWhenVisible(canvas, render);

  return () => {
    window.removeEventListener('resize', resize);
    canvas.removeEventListener('mousemove', handleMouse);
    canvas.removeEventListener('mouseleave', handleLeave);
    detener();
  };
}