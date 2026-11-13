# El camino que eliges

Juego web de narrativa y decisiones inspirado en *El Señor de los Anillos*. El jugador asume el papel de Frodo, resuelve cinco dilemas, llega a uno de tres finales y recibe un balance de sus decisiones frente a una vida lograda.

Es un sitio estático: HTML, CSS y JavaScript sin dependencias ni paso de compilación. Pesa unos 400 KB con fuentes e ilustraciones incluidas.

## Recorrido del juego

Inicio → contexto del libro → instrucciones → elección de personaje → dilemas 1 a 4 → dilema 5 → final → balance → cierre → volver a jugar.

Cada uno de los cuatro primeros dilemas sigue el mismo ciclo: situación, decisión (se marca y se confirma), consecuencia, pantalla negra con la frase y pregunta de reflexión. El dilema 5 muestra el resumen de las cuatro decisiones y abre los tres finales.

- No se puede retroceder ni cambiar una decisión. Si se recarga la página, la partida continúa donde iba.
- Solo al terminar aparece **Volver a jugar**.
- Lo que el jugador escribe en las reflexiones y en el cierre se queda en su navegador. No se envía a ningún servidor.

## Probarlo en el computador

Los módulos de JavaScript no cargan abriendo `index.html` con doble clic; hay que servir la carpeta. Cualquiera de estas opciones funciona:

```bash
npx serve .
# o
python -m http.server 8000
```

En VS Code también sirve la extensión Live Server.

## Estructura

```
index.html            Página única
css/estilos.css       Estilos
js/historia.js        Todo el texto del juego (dilemas, frases, finales, balance)
js/recursos.js        Rutas de imágenes y música
js/juego.js           Motor: recorrido, pantallas y guardado
js/sonido.js          Música ambiental y efectos
assets/img/           Fondos de cada escena
assets/fuentes/       Tipografías (licencia OFL)
assets/audio/         Música de fondo opcional
vercel.json           Cabeceras de caché y seguridad
```

Para cambiar un texto se edita `js/historia.js`. Para cambiar una imagen o la música se edita `js/recursos.js`.

## Recursos que se pueden reemplazar

El juego ya funciona con ilustraciones propias en SVG. Para usar imágenes definitivas, guárdalas en `assets/img/` y cambia la ruta correspondiente en `js/recursos.js`.

### Fondos

Formato `.webp` (o `.jpg`), 1920 × 1080 px, menos de 300 KB cada uno. Lo importante debe quedar en el centro, porque en celular se recortan los lados. Encima de la imagen va un velo oscuro, así que conviene que no sean demasiado oscuras.

| Clave en `recursos.js` | Dónde aparece | Qué debería mostrar |
| --- | --- | --- |
| `comarca` | Inicio, contexto, instrucciones, personaje | Colinas verdes, camino, atardecer |
| `monte-destino` | Dilema 1 | Volcán, lava, cielo rojo |
| `grietas` | Dilema 2 | Interior de la montaña, fuego, el Anillo |
| `celebracion` | Dilema 3 | Multitud, estandartes, luz dorada |
| `fogata` | Dilema 4 | Bosque de noche, fogata, dos figuras |
| `encrucijada` | Dilema 5 | Camino que se divide, amanecer |
| `amanecer` | Finales, balance y cierre | Amanecer sobre montañas, camino |

### Retrato (opcional)

Una imagen cuadrada de 400 × 400 px para Frodo. Se guarda en `assets/img/personajes/` y se registra en `RETRATOS` dentro de `js/recursos.js`. Si no se pone, se usa el emblema dibujado.

### Música (opcional)

Un archivo `.mp3` de música ambiental que se pueda repetir, de 1 a 3 minutos y menos de 2 MB. Las instrucciones están en `assets/audio/LEEME.txt`. Sin archivo, el juego genera un ambiente sonoro propio. Los efectos de decisión y consecuencia no necesitan archivos.

### De dónde sacar los recursos

Las imágenes y la música de las películas tienen derechos de autor. Para un sitio público es más seguro usar material libre o propio:

- Imágenes: Unsplash, Pexels, Pixabay, o ilustraciones hechas por el equipo.
- Música: Pixabay Music, Free Music Archive, incompetech.com (pide dar crédito al autor).

Para convertir y comprimir imágenes a `.webp`: squoosh.app.

## Publicar en Vercel

1. Sube el proyecto a GitHub:

   ```bash
   git add .
   git commit -m "Juego El camino que eliges"
   git push -u origin main
   ```

2. En vercel.com entra con la cuenta de GitHub y elige **Add New → Project**.
3. Importa el repositorio `proyecto-core-4`.
4. Deja la configuración como aparece: Framework Preset **Other**, sin Build Command y sin Output Directory.
5. Pulsa **Deploy**.

Desde ese momento, cada `git push` a `main` publica una versión nueva.

## Créditos

Adaptación original inspirada en *El Señor de los Anillos*, de J. R. R. Tolkien. Los diálogos, opciones y desenlaces no son citas del libro. Tipografías IM Fell English y Alegreya, bajo SIL Open Font License (ver `assets/fuentes/LICENCIA.txt`).
