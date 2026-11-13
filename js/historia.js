/*
 * TODO EL TEXTO DEL JUEGO VIVE AQUÍ.
 * Para cambiar un dilema, una frase o un final, edita este archivo: no hace
 * falta tocar nada más. Los nombres de "fondo" corresponden a las claves de
 * js/recursos.js.
 */

export const JUEGO = {
  titulo: 'El camino que eliges',
  subtitulo: 'Una historia de decisiones en la Tierra Media',
  duracion: 'Dura unos diez minutos.',
  credito:
    'Adaptación original inspirada en El Señor de los Anillos, de J. R. R. Tolkien. ' +
    'Los diálogos, opciones y desenlaces no son citas del libro.',
};

export const CONTEXTO = {
  fondo: 'comarca',
  titulo: 'Antes de empezar',
  parrafos: [
    'En la Tierra Media existe un Anillo que ofrece un poder extraordinario, pero también puede someter y corromper a quien lo posee. Sauron, el Señor Oscuro, busca recuperarlo para dominar a otros.',
    'Frodo, un hobbit acostumbrado a una vida tranquila en la Comarca, recibe la tarea de llevarlo lejos de su hogar. Su misión no consiste en utilizar ese poder, sino en contribuir a que sea destruido.',
    'Frodo no recorre el camino solo. Gandalf lo orienta, Sam lo acompaña y una comunidad de compañeros se forma para ayudarlo. Aun así, la amenaza, el cansancio y la tentación ponen a prueba su confianza.',
  ],
};

export const INSTRUCCIONES = {
  fondo: 'comarca',
  titulo: 'Cómo se juega',
  pasos: [
    'Lee la situación y elige una alternativa.',
    'Confirma tu decisión. Después de confirmarla no podrás cambiarla.',
    'Mira lo que ocurre y responde para ti la pregunta de reflexión.',
    'Sigue hasta el final. Solo entonces podrás volver a jugar y comparar caminos.',
  ],
  nota:
    'Podrás actuar de otra manera frente a una situación nueva, pero eso no borrará lo anterior.',
};

export const PERSONAJES = {
  fondo: 'comarca',
  titulo: 'Tu personaje',
  intro:
    'En este juego asumirás el papel de Frodo. No necesitas recordar nombres ni detalles del libro: cada pantalla te dará el contexto necesario.',
  lista: [
    {
      id: 'frodo',
      nombre: 'Frodo',
      rol: 'El portador del Anillo',
      descripcion:
        'Un hobbit que dejó una vida tranquila por una misión que no puede cumplir solo. Lleva el Anillo y decide qué hacer con él.',
    },
  ],
};

/*
 * Cada dilema:
 *   antecedente  -> texto que recuerda la decisión del dilema anterior (A o B),
 *                   para que el pasado siga visible cuando las rutas se unen.
 *   situacion    -> lo que ocurre ahora.
 *   opciones     -> texto del botón, consecuencia narrativa y frase de la
 *                   pantalla negra.
 *   resumen      -> cómo se nombra esa decisión en "tu recorrido" (dilema 5).
 *   balance      -> la línea que aparece en el balance final.
 */
export const DILEMAS = [
  {
    id: 'd1',
    titulo: 'El Señor Oscuro',
    criterio: 'Carácter',
    fondo: 'monte-destino',
    situacion: [
      'Llegas al Monte del Destino con el Anillo colgado del cuello y Sam a tu lado. Antes de alcanzar el fuego, una sombra te cierra el paso.',
      'Sauron te alcanza y te exige el Anillo. Si te lo pones, puedes escapar.',
    ],
    pregunta: '¿Qué decides?',
    opciones: {
      A: {
        texto: 'Enfrentarlo',
        consecuencia: [
          'Te quedas donde estás. Las piernas te tiemblan y no lo ocultas.',
          'Sam se planta a tu lado. Vences con miedo, con su ayuda y con algo de suerte.',
        ],
        frase:
          'Al enfrentar un problema a tiempo y no acumularlo, puedes tomar mejores decisiones después, sin sobrecargarte.',
        resumen: 'Enfrentaste a Sauron a tiempo.',
        balance: 'Tuviste carácter para afrontar a tiempo.',
      },
      B: {
        texto: 'Ponerte el Anillo y escapar',
        consecuencia: [
          'Te pones el Anillo y desapareces. Por un momento estás a salvo, pero Sauron sigue ahí y Sam se quedó atrás.',
          'Tienes que volver y enfrentarlo de todos modos, ahora más agotado.',
        ],
        frase: 'Huir no elimina el problema: lo acumula.',
        resumen: 'Huiste con el Anillo y tuviste que volver.',
        balance:
          'Te faltó carácter: huiste y acumulaste el problema. Afronta hoy algo pequeño.',
      },
    },
    reflexion:
      '¿Qué problema estás aplazando y qué cambiaría si lo afrontaras esta semana?',
  },
  {
    id: 'd2',
    titulo: 'El Anillo',
    criterio: 'Autenticidad',
    fondo: 'grietas',
    antecedente: {
      A: 'Enfrentaste a Sauron a tiempo y todavía te quedan fuerzas.',
      B: 'Huiste, volviste y llegas hasta aquí más cansado de lo que hacía falta.',
    },
    situacion: [
      'Venciste a Sauron. El Anillo sigue en tu mano, frente al fuego donde fue forjado.',
    ],
    pregunta: '¿Qué haces con el Anillo?',
    opciones: {
      A: {
        texto: 'Fundirlo',
        consecuencia: [
          'Abres la mano y lo dejas caer. Duele más de lo que esperabas: una parte de ti quería quedárselo.',
          'El Anillo se deshace en el fuego y su peso desaparece de tu cuello.',
        ],
        frase: 'Ser auténtico es actuar según lo que valoras, aunque soltar duela.',
        resumen: 'Fundiste el Anillo.',
        balance: 'Soltaste lo que te corrompía.',
      },
      B: {
        texto: 'Conservarlo y crear algo nuevo con su poder',
        consecuencia: [
          'Cierras el puño. Te dices que con ese poder harás algo nuevo, y que será por el bien de todos.',
          'Empiezas a decidir por los demás. Tus compañeros dejan de reconocerte.',
        ],
        frase: 'Decir «es por el bien de todos» no cambia a quién sirve el poder.',
        resumen: 'Conservaste el Anillo para usar su poder.',
        balance:
          'Te faltó autenticidad: el poder te alejó de tus valores. Escribe tus tres valores y revisa si tus decisiones los cuidan.',
      },
    },
    reflexion: '¿Qué «anillo» te cuesta soltar?',
  },
  {
    id: 'd3',
    titulo: 'Los aplausos',
    criterio: 'Autoestima',
    fondo: 'celebracion',
    antecedente: {
      A: 'El Anillo ya no existe, y la noticia llegó antes que tú.',
      B: 'Regresas con el Anillo todavía contigo. La gente solo sabe que Sauron cayó.',
    },
    situacion: [
      'Una multitud te recibe con cantos y estandartes. Todos esperan un héroe perfecto que nunca dudó.',
    ],
    pregunta: '¿Cómo respondes?',
    opciones: {
      A: {
        texto: 'Contar la historia real, con miedos y con la ayuda de Sam',
        consecuencia: [
          'Cuentas lo que pasó de verdad: que tuviste miedo, que dudaste y que sin Sam no habrías llegado.',
          'Algunos aplauden menos. Sam, entre la gente, sonríe.',
        ],
        frase: 'La autoestima sana no depende de la aprobación.',
        resumen: 'Contaste la historia real.',
        balance: 'Mantuviste tu autoestima.',
      },
      B: {
        texto: 'Aceptar el papel del héroe perfecto',
        consecuencia: [
          'Sonríes y dejas que cuenten la historia como quieren oírla. Los aplausos crecen.',
          'En ese relato Sam casi no aparece, y tú empiezas a cuidar una imagen que no es la tuya.',
        ],
        frase:
          'Si dejas que la sociedad decida quién eres, tu valor queda en manos de otros.',
        resumen: 'Aceptaste el papel del héroe perfecto.',
        balance:
          'Te faltó autoestima: dejaste que la sociedad decidiera quién eres. Cuéntale a alguien de confianza qué has fingido.',
      },
    },
    reflexion: '¿Qué has fingido para encajar?',
  },
  {
    id: 'd4',
    titulo: 'Sam',
    criterio: 'Responsabilidad',
    fondo: 'fogata',
    antecedente: {
      A: 'Contaste la historia como fue, y Sam estaba en ella.',
      B: 'En la historia que todos repiten, Sam casi no aparece.',
    },
    situacion: [
      'Esa noche, junto al fuego, Sam te dice que algunas decisiones tuyas lo afectaron.',
    ],
    pregunta: '¿Qué haces?',
    opciones: {
      A: {
        texto: 'Escuchar, reconocer y proponer reparar',
        consecuencia: [
          'Lo escuchas sin interrumpir. Reconoces lo que hiciste, sin adornarlo, y le propones algo concreto para repararlo.',
          'Sam no responde enseguida, pero se queda junto al fuego.',
        ],
        frase: 'Una disculpa inicia el proceso, la reparación lo sostiene.',
        resumen: 'Escuchaste a Sam y propusiste reparar.',
        balance: 'Asumiste y reparaste.',
      },
      B: {
        texto: 'Justificarte o culpar a las circunstancias',
        consecuencia: [
          'Le explicas que no tuviste opción: el Anillo, el cansancio, lo que todos esperaban de ti.',
          'Sam asiente y deja de hablar. La conversación termina, pero lo que le dolía sigue ahí.',
        ],
        frase:
          'Explicar no es justificar: si culpas a otros, pierdes poder para cambiar.',
        resumen: 'Te justificaste ante Sam.',
        balance:
          'Te faltó responsabilidad: justificaste en vez de reparar. Propón un acuerdo concreto a quien afectaste.',
      },
    },
    reflexion: '¿Cuándo dijiste «no tuve opción» cuando sí la tenías?',
  },
];

export const DILEMA_FINAL = {
  id: 'd5',
  titulo: 'Cómo continuar',
  fondo: 'encrucijada',
  antecedente: {
    A: 'Sam sigue a tu lado después de la conversación junto al fuego.',
    B: 'Sam sigue a tu lado, aunque lo que te dijo junto al fuego quedó sin resolver.',
  },
  situacion: ['Amanece y el camino se divide. Antes de dar el siguiente paso, mira lo que has decidido hasta aquí.'],
  tituloResumen: 'Tu recorrido',
  pregunta:
    '¿Qué necesitas hacer ahora para seguir con una decisión que puedas sostener y que cuide a quienes te acompañan?',
  opciones: {
    A: { texto: 'Compartir la carga con Sam', final: 'f1' },
    B: { texto: 'Detenerte a reconocer y reparar', final: 'f2' },
    C: { texto: 'Reorganizar tu compromiso con un límite claro', final: 'f3' },
  },
};

export const FINALES = {
  f1: {
    numero: 1,
    titulo: 'Una misión compartida',
    fondo: 'amanecer',
    texto:
      'Frodo entiende que su compromiso no consiste en cargar con todo solo. Sam lo acompaña conociendo los riesgos y ambos acuerdan hablar cuando el miedo o el cansancio los superen. La misión sigue gracias a la confianza.',
    vidaLograda:
      'Cuidar tus relaciones y aceptar apoyo te permite sostener decisiones valiosas.',
    accion: 'Pide ayuda con sinceridad esta semana.',
  },
  f2: {
    numero: 2,
    titulo: 'Un nuevo comienzo responsable',
    fondo: 'amanecer',
    texto:
      'Frodo revisa el camino con sus compañeros. Cuenta lo que ocultó, reconoce sus límites y corrige lo prometido. La confianza no vuelve de inmediato: el grupo fija compromisos que se pueden verificar.',
    vidaLograda: 'Aprender de un error es reconocerlo, repararlo y cambiar.',
    accion: 'Cumple un acuerdo de reparación sin exigir que olviden el daño.',
  },
  f3: {
    numero: 3,
    titulo: 'Un compromiso elegido con sinceridad',
    fondo: 'amanecer',
    texto:
      'Frodo separa el propósito de la misión del deseo de demostrar que puede con todo. Dice qué puede asumir y qué necesita cambiar, y la comunidad reorganiza las tareas sin dejar nada desprotegido.',
    vidaLograda:
      'Actuar según tus capacidades y convicciones sin abandonar a otros.',
    accion: 'Renegocia un compromiso a tiempo y deja a alguien que continúe.',
  },
};

export const BALANCE = {
  fondo: 'amanecer',
  titulo: 'Tu balance',
  intro: 'Una línea por cada decisión que tomaste.',
  // Se elige según cuántas de las cuatro primeras decisiones fueron A.
  veredictos: [
    {
      minimo: 4,
      titulo: 'Llegaste a una vida lograda',
      texto:
        'Tus decisiones fueron coherentes con lo que valoras y cuidaron a otros. Sostén este patrón también cuando haya miedo.',
    },
    {
      minimo: 2,
      titulo: 'Estás en camino',
      texto:
        'Elige el criterio que te faltó y haz una acción concreta esta semana.',
    },
    {
      minimo: 0,
      titulo: 'Todavía no llegaste',
      texto:
        'Con más carácter, mejores decisiones, autoestima propia y responsabilidad, el camino cambia.',
    },
  ],
};

export const CIERRE = {
  fondo: 'amanecer',
  titulo: 'Antes de irte',
  // Solo se muestra si alguna de las cuatro decisiones fue B.
  siFalto:
    'Si hubieras tenido más carácter para afrontar, más decisión para no huir, más autoestima para no dejarte corromper por la sociedad y más responsabilidad para reparar, habrías llegado.',
  pregunta: '¿Qué aprendiste de tu forma de elegir?',
  campos: [
    { id: 'valor', etiqueta: 'Un valor que quieres cuidar' },
    { id: 'persona', etiqueta: 'Una persona afectada por tus decisiones' },
    { id: 'accion', etiqueta: 'Una acción concreta para esta semana' },
  ],
  privacidad: 'Lo que escribas se queda en este dispositivo. No se envía a ningún lugar.',
  tituloCompromiso: 'Tu compromiso',
  reiniciar: {
    siFalto: 'Empieza de nuevo y cambia la decisión donde te faltó carácter.',
    siLlego: 'Empieza de nuevo y compara este camino con otro.',
  },
};
