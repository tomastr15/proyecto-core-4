/*
 * Sonido: música ambiental y efectos puntuales.
 * Los efectos se generan con Web Audio, sin archivos. La música usa el
 * archivo indicado en recursos.js o, si no hay, un ambiente generado.
 */
import { MUSICA, VOLUMEN_MUSICA } from './recursos.js';

const CLAVE = 'ece-sonido';
let ctx = null;
let salida = null; // ganancia general
let pista = null; // <audio> de la música
let ambiente = null; // nodos del ambiente generado
let activo = leerPreferencia();

function leerPreferencia() {
  try {
    return localStorage.getItem(CLAVE) !== 'no';
  } catch {
    return true;
  }
}

function guardarPreferencia() {
  try {
    localStorage.setItem(CLAVE, activo ? 'si' : 'no');
  } catch {
    /* sin almacenamiento: la preferencia dura solo esta visita */
  }
}

export function sonidoActivo() {
  return activo;
}

/* Debe llamarse desde un clic: los navegadores no dejan sonar antes. */
export function iniciarSonido() {
  if (ctx) {
    if (ctx.state === 'suspended') ctx.resume();
    return;
  }
  const Ctor = window.AudioContext || window.webkitAudioContext;
  if (!Ctor) return;
  ctx = new Ctor();
  salida = ctx.createGain();
  salida.gain.value = activo ? 1 : 0;
  salida.connect(ctx.destination);
  iniciarMusica();
}

function iniciarMusica() {
  if (MUSICA) {
    pista = new Audio(MUSICA);
    pista.loop = true;
    pista.volume = VOLUMEN_MUSICA;
    pista.addEventListener('error', () => {
      pista = null;
      iniciarAmbiente();
    });
    if (activo) pista.play().catch(() => {});
  } else {
    iniciarAmbiente();
  }
}

/* Acorde grave y lento (re menor) que respira; casi inaudible a propósito. */
function iniciarAmbiente() {
  if (!ctx || ambiente) return;
  const filtro = ctx.createBiquadFilter();
  filtro.type = 'lowpass';
  filtro.frequency.value = 520;
  const mezcla = ctx.createGain();
  mezcla.gain.value = 0;
  mezcla.gain.linearRampToValueAtTime(0.055, ctx.currentTime + 6);
  filtro.connect(mezcla).connect(salida);

  const notas = [73.42, 110, 146.83, 174.61, 220];
  const nodos = notas.map((frecuencia, i) => {
    const osc = ctx.createOscillator();
    osc.type = i % 2 ? 'sine' : 'triangle';
    osc.frequency.value = frecuencia;
    osc.detune.value = (i - 2) * 4;
    const voz = ctx.createGain();
    voz.gain.value = 0.5;
    const lfo = ctx.createOscillator();
    lfo.frequency.value = 0.03 + i * 0.017;
    const profundidad = ctx.createGain();
    profundidad.gain.value = 0.45;
    lfo.connect(profundidad).connect(voz.gain);
    osc.connect(voz).connect(filtro);
    osc.start();
    lfo.start();
    return osc;
  });
  ambiente = { nodos, mezcla };
}

export function alternarSonido() {
  activo = !activo;
  guardarPreferencia();
  if (activo) iniciarSonido();
  if (salida) salida.gain.setTargetAtTime(activo ? 1 : 0, ctx.currentTime, 0.08);
  if (pista) {
    if (activo) pista.play().catch(() => {});
    else pista.pause();
  }
  return activo;
}

function tono({ frecuencia, hasta, duracion, volumen, tipo = 'sine', retraso = 0 }) {
  if (!ctx || !activo) return;
  const t = ctx.currentTime + retraso;
  const osc = ctx.createOscillator();
  const gan = ctx.createGain();
  osc.type = tipo;
  osc.frequency.setValueAtTime(frecuencia, t);
  if (hasta) osc.frequency.exponentialRampToValueAtTime(hasta, t + duracion);
  gan.gain.setValueAtTime(0.0001, t);
  gan.gain.exponentialRampToValueAtTime(volumen, t + 0.012);
  gan.gain.exponentialRampToValueAtTime(0.0001, t + duracion);
  osc.connect(gan).connect(salida);
  osc.start(t);
  osc.stop(t + duracion + 0.05);
}

export const efectos = {
  /* Marcar una alternativa. */
  seleccionar() {
    tono({ frecuencia: 587, duracion: 0.14, volumen: 0.05, tipo: 'triangle' });
  },
  /* Confirmar una decisión: campana. */
  decidir() {
    tono({ frecuencia: 196, duracion: 2.2, volumen: 0.14 });
    tono({ frecuencia: 293.7, duracion: 1.8, volumen: 0.08 });
    tono({ frecuencia: 588, duracion: 1.2, volumen: 0.035 });
  },
  /* Entrar a la pantalla negra: golpe grave. */
  consecuencia() {
    tono({ frecuencia: 92, hasta: 40, duracion: 0.9, volumen: 0.3 });
  },
  /* Llegar a un final: tres notas ascendentes. */
  final() {
    [146.8, 220, 293.7].forEach((frecuencia, i) =>
      tono({ frecuencia, duracion: 2.4, volumen: 0.09, retraso: i * 0.28 }),
    );
  },
  avanzar() {
    tono({ frecuencia: 330, duracion: 0.09, volumen: 0.03, tipo: 'triangle' });
  },
};
