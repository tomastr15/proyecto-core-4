/*
 * Motor del juego: guarda el recorrido, decide qué pantalla sigue y la dibuja.
 * El texto está en historia.js y las imágenes y el sonido en recursos.js.
 */
import {
  JUEGO, CONTEXTO, INSTRUCCIONES, PERSONAJES, DILEMAS, DILEMA_FINAL, FINALES, BALANCE, CIERRE,
} from './historia.js';
import { FONDOS, RETRATOS } from './recursos.js';
import { iniciarSonido, alternarSonido, sonidoActivo, efectos } from './sonido.js';

const CLAVE = 'ece-partida';
const VISTAS = [
  'inicio', 'contexto', 'instrucciones', 'personaje',
  'dilema', 'consecuencia', 'frase', 'reflexion',
  'dilemaFinal', 'final', 'balance', 'cierre',
];
const TOTAL_DILEMAS = DILEMAS.length + 1;

const nuevaPartida = () => ({
  vista: 'inicio',
  paso: 0, // índice del dilema actual (0 a 3)
  decisiones: [], // 'A' o 'B' por cada uno de los cuatro primeros dilemas
  notas: [], // respuestas opcionales a las reflexiones
  final: null, // 'f1' | 'f2' | 'f3'
  compromiso: null, // { valor, persona, accion } al cerrar
});

let estado = cargar();
let seleccion = null; // alternativa marcada pero aún no confirmada

const $pantalla = document.getElementById('pantalla');
const $progreso = document.getElementById('progreso');
const $sonido = document.getElementById('sonido');
const $capas = [...document.querySelectorAll('#fondo .capa')];
let capaActiva = 0;
let fondoActual = null;

/* ---------- Guardado: si se recarga la página, la partida continúa ---------- */

function cargar() {
  try {
    const dato = JSON.parse(sessionStorage.getItem(CLAVE));
    const valido =
      dato &&
      VISTAS.includes(dato.vista) &&
      Array.isArray(dato.decisiones) &&
      dato.decisiones.every((d) => d === 'A' || d === 'B') &&
      Number.isInteger(dato.paso) &&
      dato.paso >= 0 &&
      dato.paso < DILEMAS.length &&
      (dato.final === null || dato.final in FINALES);
    if (valido) return { ...nuevaPartida(), ...dato };
  } catch {
    /* sin almacenamiento o dato dañado: se empieza de cero */
  }
  return nuevaPartida();
}

function guardar() {
  try {
    sessionStorage.setItem(CLAVE, JSON.stringify(estado));
  } catch {
    /* el juego funciona igual sin guardar */
  }
}

/* ---------- Utilidades ---------- */

const esc = (texto) =>
  String(texto).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

const parrafos = (lista) => lista.map((p) => `<p>${esc(p)}</p>`).join('');

const aciertos = () => estado.decisiones.filter((d) => d === 'A').length;

const ICONOS = {
  si: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  no: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="7.5" fill="none" stroke="currentColor" stroke-width="2.2" stroke-dasharray="3.2 3.2"/></svg>',
  anillo:
    '<svg viewBox="0 0 64 64" aria-hidden="true"><ellipse cx="32" cy="32" rx="19" ry="22" fill="none" stroke="currentColor" stroke-width="6"/><ellipse cx="32" cy="32" rx="19" ry="22" fill="none" stroke="#fff3c4" stroke-width="1.2" opacity=".7"/></svg>',
  frodo:
    '<svg viewBox="0 0 64 64" aria-hidden="true"><ellipse cx="32" cy="34" rx="15" ry="18" fill="none" stroke="currentColor" stroke-width="5"/><path d="M22 14c3-6 17-6 20 0" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/></svg>',
};

/* ---------- Pantallas ---------- */

const pantallas = {
  inicio: () => `
    <section class="portada">
      <div class="sello">${ICONOS.anillo}</div>
      <h1 tabindex="-1">${esc(JUEGO.titulo)}</h1>
      <p class="subtitulo">${esc(JUEGO.subtitulo)}</p>
      <button class="boton" data-accion="avanzar">Comenzar</button>
      <p class="credito">${esc(JUEGO.duracion)} ${esc(JUEGO.credito)}</p>
    </section>`,

  contexto: () => `
    <article class="folio">
      <h1 tabindex="-1">${esc(CONTEXTO.titulo)}</h1>
      ${parrafos(CONTEXTO.parrafos)}
      <button class="boton" data-accion="avanzar">Continuar</button>
    </article>`,

  instrucciones: () => `
    <article class="folio">
      <h1 tabindex="-1">${esc(INSTRUCCIONES.titulo)}</h1>
      <ol class="pasos">${INSTRUCCIONES.pasos.map((p) => `<li>${esc(p)}</li>`).join('')}</ol>
      <p class="nota">${esc(INSTRUCCIONES.nota)}</p>
      <button class="boton" data-accion="avanzar">Entendido</button>
    </article>`,

  personaje: () => `
    <article class="folio">
      <h1 tabindex="-1">${esc(PERSONAJES.titulo)}</h1>
      <p>${esc(PERSONAJES.intro)}</p>
      <ul class="personajes">
        ${PERSONAJES.lista.map(tarjetaPersonaje).join('')}
      </ul>
    </article>`,

  dilema: () => {
    const d = DILEMAS[estado.paso];
    const previa = estado.decisiones[estado.paso - 1];
    return vistaDilema(d, d.antecedente?.[previa], '');
  },

  consecuencia: () => {
    const d = DILEMAS[estado.paso];
    const o = d.opciones[estado.decisiones[estado.paso]];
    return `
      <article class="folio">
        <p class="elegiste">Elegiste: «${esc(o.texto)}».</p>
        <h1 tabindex="-1">Lo que ocurre</h1>
        ${parrafos(o.consecuencia)}
        <button class="boton" data-accion="avanzar">Continuar</button>
      </article>`;
  },

  frase: () => {
    const d = DILEMAS[estado.paso];
    const o = d.opciones[estado.decisiones[estado.paso]];
    return `
      <section class="intertitulo">
        <h1 class="solo-lectores" tabindex="-1">${esc(d.criterio)}</h1>
        <blockquote>${esc(o.frase)}</blockquote>
        <button class="boton claro" data-accion="avanzar">Continuar</button>
      </section>`;
  },

  reflexion: () => {
    const d = DILEMAS[estado.paso];
    return `
      <article class="folio">
        <h1 tabindex="-1">¿Qué habrías hecho tú?</h1>
        <p class="pregunta">${esc(d.reflexion)}</p>
        <label class="campo">
          <span>Si quieres, escribe tu respuesta. Solo tú la verás.</span>
          <textarea id="nota" rows="3" maxlength="400">${esc(estado.notas[estado.paso] || '')}</textarea>
        </label>
        <button class="boton" data-accion="avanzar">Continuar</button>
      </article>`;
  },

  dilemaFinal: () => {
    const previa = estado.decisiones[DILEMAS.length - 1];
    const resumen = `
      <section class="recorrido" aria-labelledby="t-recorrido">
        <h2 id="t-recorrido">${esc(DILEMA_FINAL.tituloResumen)}</h2>
        <ol>
          ${DILEMAS.map((d, i) => `<li><span>${esc(d.titulo)}</span>${esc(d.opciones[estado.decisiones[i]].resumen)}</li>`).join('')}
        </ol>
      </section>`;
    return vistaDilema(DILEMA_FINAL, DILEMA_FINAL.antecedente[previa], resumen);
  },

  final: () => {
    const f = FINALES[estado.final];
    return `
      <article class="folio final">
        <p class="elegiste">Final ${f.numero} de ${Object.keys(FINALES).length}</p>
        <h1 tabindex="-1">${esc(f.titulo)}</h1>
        <p>${esc(f.texto)}</p>
        <dl class="aprendizaje">
          <div><dt>Vida lograda</dt><dd>${esc(f.vidaLograda)}</dd></div>
          <div><dt>Tu acción</dt><dd>${esc(f.accion)}</dd></div>
        </dl>
        <button class="boton" data-accion="avanzar">Ver mi balance</button>
      </article>`;
  },

  balance: () => {
    const n = aciertos();
    const v = BALANCE.veredictos.find((x) => n >= x.minimo);
    return `
      <article class="folio">
        <h1 tabindex="-1">${esc(BALANCE.titulo)}</h1>
        <p>${esc(BALANCE.intro)}</p>
        <ul class="balance">
          ${DILEMAS.map((d, i) => {
            const letra = estado.decisiones[i];
            const nota = estado.notas[i];
            return `
              <li class="${letra === 'A' ? 'logro' : 'falta'}">
                <span class="marca">${letra === 'A' ? ICONOS.si : ICONOS.no}</span>
                <div>
                  <strong>${esc(d.titulo)}</strong>
                  <p>${esc(d.opciones[letra].balance)}</p>
                  ${nota ? `<p class="mi-nota">Escribiste: «${esc(nota)}»</p>` : ''}
                </div>
              </li>`;
          }).join('')}
        </ul>
        <section class="veredicto">
          <p class="cuenta">${n} de ${DILEMAS.length}</p>
          <h2>${esc(v.titulo)}</h2>
          <p>${esc(v.texto)}</p>
        </section>
        <button class="boton" data-accion="avanzar">Continuar</button>
      </article>`;
  },

  cierre: () => {
    const falto = aciertos() < DILEMAS.length;
    if (!estado.compromiso) {
      return `
        <article class="folio">
          <h1 tabindex="-1">${esc(CIERRE.titulo)}</h1>
          ${falto ? `<p>${esc(CIERRE.siFalto)}</p>` : ''}
          <p class="pregunta">${esc(CIERRE.pregunta)}</p>
          <form id="compromiso" novalidate>
            ${CIERRE.campos.map((c) => `
              <label class="campo">
                <span>${esc(c.etiqueta)}</span>
                <input type="text" name="${c.id}" maxlength="140" autocomplete="off">
              </label>`).join('')}
            <p class="nota">${esc(CIERRE.privacidad)}</p>
            <button class="boton" type="submit">Guardar mi compromiso</button>
          </form>
        </article>`;
    }
    const escritos = CIERRE.campos.filter((c) => estado.compromiso[c.id]);
    return `
      <article class="folio">
        <h1 tabindex="-1">${esc(escritos.length ? CIERRE.tituloCompromiso : 'Fin del recorrido')}</h1>
        ${escritos.length ? `
          <dl class="aprendizaje">
            ${escritos.map((c) => `<div><dt>${esc(c.etiqueta)}</dt><dd>${esc(estado.compromiso[c.id])}</dd></div>`).join('')}
          </dl>` : ''}
        <p>${esc(falto ? CIERRE.reiniciar.siFalto : CIERRE.reiniciar.siLlego)}</p>
        <button class="boton" data-accion="reiniciar">Volver a jugar</button>
      </article>`;
  },
};

function tarjetaPersonaje(p) {
  const retrato = RETRATOS[p.id]
    ? `<img src="${esc(RETRATOS[p.id])}" alt="" width="96" height="96" loading="lazy">`
    : ICONOS[p.id] || ICONOS.anillo;
  const cuerpo = `
    <span class="retrato">${retrato}</span>
    <span class="datos">
      <strong>${esc(p.nombre)}</strong>
      <em>${esc(p.rol)}</em>
      <span>${esc(p.descripcion)}</span>
    </span>`;
  return `<li><button class="personaje" data-accion="avanzar">${cuerpo}<span class="llamada">Jugar como ${esc(p.nombre)}</span></button></li>`;
}

function vistaDilema(d, antecedente, extra) {
  return `
    <article class="folio dilema">
      ${antecedente ? `<p class="antecedente">${esc(antecedente)}</p>` : ''}
      <h1 tabindex="-1">${esc(d.titulo)}</h1>
      ${parrafos(d.situacion)}
      ${extra}
      <p class="pregunta" id="pregunta">${esc(d.pregunta)}</p>
      <div class="opciones" role="group" aria-labelledby="pregunta">
        ${Object.entries(d.opciones).map(([letra, o]) => `
          <button class="opcion" data-opcion="${letra}" aria-pressed="false">
            <span class="letra">${letra}</span><span>${esc(o.texto)}</span>
          </button>`).join('')}
      </div>
      <button class="boton" data-accion="confirmar" disabled>Confirmar decisión</button>
      <p class="nota" id="aviso">Elige una alternativa. Al confirmarla no podrás cambiarla.</p>
    </article>`;
}

/* ---------- Navegación: siempre hacia adelante ---------- */

function avanzar() {
  const ultimo = estado.paso === DILEMAS.length - 1;
  switch (estado.vista) {
    case 'inicio': estado.vista = 'contexto'; break;
    case 'contexto': estado.vista = 'instrucciones'; break;
    case 'instrucciones': estado.vista = 'personaje'; break;
    case 'personaje': estado.vista = 'dilema'; break;
    case 'consecuencia': estado.vista = 'frase'; efectos.consecuencia(); break;
    case 'frase': estado.vista = 'reflexion'; break;
    case 'reflexion': {
      const nota = document.getElementById('nota');
      estado.notas[estado.paso] = nota ? nota.value.trim() : '';
      if (ultimo) estado.vista = 'dilemaFinal';
      else { estado.paso += 1; estado.vista = 'dilema'; }
      break;
    }
    case 'final': estado.vista = 'balance'; break;
    case 'balance': estado.vista = 'cierre'; break;
    default: return;
  }
  if (estado.vista !== 'frase') efectos.avanzar();
  mostrar();
}

function confirmar() {
  if (!seleccion) return;
  if (estado.vista === 'dilema') {
    estado.decisiones[estado.paso] = seleccion;
    estado.vista = 'consecuencia';
    efectos.decidir();
  } else if (estado.vista === 'dilemaFinal') {
    estado.final = DILEMA_FINAL.opciones[seleccion].final;
    estado.vista = 'final';
    efectos.final();
  }
  mostrar();
}

function reiniciar() {
  estado = nuevaPartida();
  mostrar();
}

/* ---------- Dibujo ---------- */

function fondoDe() {
  switch (estado.vista) {
    case 'inicio': case 'contexto': return CONTEXTO.fondo;
    case 'instrucciones': return INSTRUCCIONES.fondo;
    case 'personaje': return PERSONAJES.fondo;
    case 'dilema': case 'consecuencia': case 'reflexion': return DILEMAS[estado.paso].fondo;
    case 'frase': return null; // pantalla negra
    case 'dilemaFinal': return DILEMA_FINAL.fondo;
    case 'final': return FINALES[estado.final].fondo;
    case 'balance': return BALANCE.fondo;
    default: return CIERRE.fondo;
  }
}

function siguienteFondo() {
  if (estado.vista === 'personaje') return DILEMAS[0].fondo;
  if (estado.vista === 'reflexion') {
    return estado.paso < DILEMAS.length - 1 ? DILEMAS[estado.paso + 1].fondo : DILEMA_FINAL.fondo;
  }
  if (estado.vista === 'dilemaFinal') return FINALES.f1.fondo;
  return null;
}

function pintarFondo() {
  const clave = fondoDe();
  document.body.classList.toggle('negra', clave === null);
  if (clave === null || clave === fondoActual) return;
  const ruta = FONDOS[clave];
  fondoActual = clave;
  if (!ruta) return;
  const entra = $capas[1 - capaActiva];
  const sale = $capas[capaActiva];
  const img = new Image();
  const cambiar = () => {
    if (fondoActual !== clave) return; // ya se pidió otro fondo
    entra.style.backgroundImage = `url("${ruta}")`;
    entra.classList.add('visible');
    sale.classList.remove('visible');
    capaActiva = 1 - capaActiva;
  };
  img.onload = cambiar;
  img.onerror = () => console.warn(`No se encontró la imagen de fondo: ${ruta}`);
  img.src = ruta;
}

function pintarProgreso() {
  const enDilemas = ['dilema', 'consecuencia', 'frase', 'reflexion', 'dilemaFinal'].includes(estado.vista);
  $progreso.hidden = !enDilemas;
  if (!enDilemas) return;
  const actual = estado.vista === 'dilemaFinal' ? TOTAL_DILEMAS : estado.paso + 1;
  const marcas = Array.from({ length: TOTAL_DILEMAS }, (_, i) =>
    `<i class="${i + 1 < actual ? 'hecho' : i + 1 === actual ? 'actual' : ''}"></i>`).join('');
  $progreso.innerHTML = `<span>Dilema ${actual} de ${TOTAL_DILEMAS}</span><span class="marcas" aria-hidden="true">${marcas}</span>`;
}

function pintarSonido() {
  const activo = sonidoActivo();
  $sonido.setAttribute('aria-pressed', String(activo));
  $sonido.querySelector('span').textContent = activo ? 'Sonido activado' : 'Sonido apagado';
  $sonido.classList.toggle('apagado', !activo);
}

function mostrar({ enfocar = true } = {}) {
  seleccion = null;
  guardar();
  document.body.dataset.vista = estado.vista;
  pintarFondo();
  pintarProgreso();
  try {
    $pantalla.innerHTML = pantallas[estado.vista]();
  } catch (error) {
    // Partida guardada incompleta o dañada: se vuelve al inicio.
    console.warn('No se pudo retomar la partida; se reinicia.', error);
    estado = nuevaPartida();
    guardar();
    document.body.dataset.vista = estado.vista;
    pintarFondo();
    pintarProgreso();
    $pantalla.innerHTML = pantallas.inicio();
  }
  $pantalla.classList.remove('entra');
  void $pantalla.offsetWidth; // reinicia la animación de entrada
  $pantalla.classList.add('entra');
  window.scrollTo(0, 0);
  if (enfocar) $pantalla.querySelector('h1')?.focus({ preventScroll: true });
  const proximo = siguienteFondo();
  if (proximo && FONDOS[proximo]) new Image().src = FONDOS[proximo];
}

/* ---------- Eventos ---------- */

$pantalla.addEventListener('click', (evento) => {
  const opcion = evento.target.closest('[data-opcion]');
  if (opcion) {
    iniciarSonido();
    seleccion = opcion.dataset.opcion;
    $pantalla.querySelectorAll('[data-opcion]').forEach((b) =>
      b.setAttribute('aria-pressed', String(b === opcion)));
    $pantalla.querySelector('[data-accion="confirmar"]').disabled = false;
    document.getElementById('aviso').textContent = 'Al confirmar no podrás cambiar esta decisión.';
    efectos.seleccionar();
    return;
  }
  const boton = evento.target.closest('[data-accion]');
  if (!boton || boton.disabled) return;
  iniciarSonido();
  ({ avanzar, confirmar, reiniciar })[boton.dataset.accion]?.();
});

$pantalla.addEventListener('submit', (evento) => {
  if (evento.target.id !== 'compromiso') return;
  evento.preventDefault();
  const datos = new FormData(evento.target);
  estado.compromiso = Object.fromEntries(CIERRE.campos.map((c) => [c.id, String(datos.get(c.id) || '').trim()]));
  efectos.avanzar();
  mostrar();
});

$sonido.addEventListener('click', () => {
  alternarSonido();
  pintarSonido();
});

pintarSonido();
mostrar({ enfocar: false });
