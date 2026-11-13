/*
 * IMÁGENES Y SONIDO.
 *
 * Para cambiar un fondo: guarda tu imagen en assets/img/ y escribe aquí su
 * nombre. Ejemplo:  'monte-destino': 'assets/img/monte-destino.webp'
 * Tamaño recomendado: 1920 x 1080 px, formato .webp, menos de 300 KB.
 * Deja lo importante en el centro: en celular se recortan los lados.
 */
export const FONDOS = {
  comarca: 'assets/img/comarca.svg', // inicio, contexto, instrucciones, personaje
  'monte-destino': 'assets/img/monte-destino.svg', // dilema 1
  grietas: 'assets/img/grietas.svg', // dilema 2
  celebracion: 'assets/img/celebracion.svg', // dilema 3
  fogata: 'assets/img/fogata.svg', // dilema 4
  encrucijada: 'assets/img/encrucijada.svg', // dilema 5
  amanecer: 'assets/img/amanecer.svg', // finales, balance y cierre
};

/*
 * Retrato de Frodo en la pantalla de personaje (opcional). Si se deja vacío
 * se usa el emblema dibujado. Tamaño recomendado: 400 x 400 px, .webp.
 * Ejemplo:  frodo: 'assets/img/personajes/frodo.webp'
 */
export const RETRATOS = {
  frodo: '',
};

/*
 * Música de fondo (opcional). Guarda el archivo en assets/audio/ y escribe
 * aquí su ruta, por ejemplo 'assets/audio/musica.mp3'. Si se deja vacío, el
 * juego genera un ambiente sonoro propio. Los efectos de decisión y de
 * consecuencia siempre los genera el juego: no necesitan archivos.
 */
export const MUSICA = '';
export const VOLUMEN_MUSICA = 0.35;
