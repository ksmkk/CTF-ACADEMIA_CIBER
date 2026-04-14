const WARMUP_SECTIONS = [
  {
    slug: 'csrf',
    title: 'CSRF Attack',
    intro: 'Aprende como una pagina maliciosa puede hacer una accion en tu cuenta sin pedir permiso.',
    levels: [
      {
        id: 1,
        title: 'Nivel A: accion sin permiso',
        objective: 'Ver como una accion importante se puede ejecutar sin confirmar al usuario.',
        open: 'Lee la seccion "Mini ejercicio" de esta tarjeta.',
        observe: 'Que una accion puede pasar sin permiso del usuario.',
        deliver: 'Escribe la respuesta, pulsa "Comprobar respuesta" y luego valida la flag abajo.',
        challenge: 'Si una pagina externa fuerza una accion sin permiso, ¿que ataque es?',
        sampleAnswer: 'csrf',
        answer: 'csrf',
        steps: [
          'Lee la guia rapida de esta tarjeta.',
          'Responde el mini ejercicio.',
          'Con la flag obtenida, valida abajo.'
        ],
        hints: [
          'Este ataque usa la sesion activa del usuario.',
          'No necesita que el usuario apriete confirmar en la app real.',
          'La respuesta es el nombre del ataque.'
        ]
      },
      {
        id: 2,
        title: 'Nivel B: sesion activa',
        objective: 'Comprobar que una sesion abierta puede usarse en contra del usuario.',
        open: 'Lee la pregunta del mini ejercicio en esta tarjeta.',
        observe: 'Que falta una proteccion en el formulario.',
        deliver: 'Responde, pulsa "Comprobar respuesta" y valida la flag que aparezca.',
        challenge: 'Para evitar CSRF en formularios, ¿que elemento de seguridad se agrega normalmente?',
        sampleAnswer: 'token',
        answer: 'token',
        steps: [
          'Lee el enunciado de proteccion.',
          'Responde el mini ejercicio.',
          'Cuando salga la flag, validala.'
        ],
        hints: [
          'El nombre corto es de 5 letras.',
          'Va en formularios y cambia en cada sesion o solicitud.',
          'Sin eso, el formulario queda expuesto.'
        ]
      }
    ]
  },
  {
    slug: 'login',
    title: 'Login Debil',
    intro: 'Practica errores de login comunes en apps reales.',
    levels: [
      {
        id: 3,
        title: 'Nivel A: muchos intentos',
        objective: 'Comprobar si el login permite demasiados intentos sin bloqueo.',
        open: 'Lee la pregunta del mini ejercicio de esta tarjeta.',
        observe: 'Que el sistema deberia limitar intentos seguidos.',
        deliver: 'Escribe la respuesta, pulsa "Comprobar respuesta" y luego valida la flag.',
        challenge: '¿Como se llama el control que limita intentos de login por tiempo?',
        sampleAnswer: 'rate limit',
        answer: 'rate limit',
        steps: [
          'Lee el problema del login.',
          'Responde el mini ejercicio.',
          'Valida la flag para continuar.'
        ],
        hints: [
          'Es un limite de velocidad/cantidad de intentos.',
          'Se suele aplicar por IP o por usuario.',
          'Sin este control, la fuerza bruta es mas facil.'
        ]
      },
      {
        id: 4,
        title: 'Nivel B: clave facil',
        objective: 'Entender por que claves simples son peligrosas.',
        open: 'Lee el mini ejercicio de esta tarjeta.',
        observe: 'Que un PIN como 0000 es muy facil de adivinar.',
        deliver: 'Responde la pregunta, comprueba y valida la flag.',
        challenge: 'Una clave como 0000 se considera clave...',
        sampleAnswer: 'debil',
        answer: 'debil',
        steps: [
          'Piensa en el riesgo de claves faciles.',
          'Responde el mini ejercicio.',
          'Valida la flag y avanza.'
        ],
        hints: [
          'No es segura ni robusta.',
          'Es corta y comun.',
          'La palabra esperada describe baja seguridad.'
        ]
      }
    ]
  },
  {
    slug: 'sqli',
    title: 'SQL Injection',
    intro: 'Aprende a detectar y explotar un login con SQL Injection.',
    levels: [
      {
        id: 5,
        title: 'Nivel A: inyeccion alternativa',
        objective: 'Resolver el login con una inyeccion distinta al OR 1=1.',
        open: 'Lee la pregunta del mini ejercicio.',
        observe: 'Que SQLi tambien puede usar UNION.',
        deliver: 'Escribe la respuesta, comprueba y valida la flag.',
        challenge: '¿Que palabra SQL se usa para unir resultados de consultas?',
        sampleAnswer: 'union',
        answer: 'union',
        steps: [
          'Lee la tecnica indicada.',
          'Responde el mini ejercicio.',
          'Valida la flag para continuar.'
        ],
        hints: [
          'No es OR 1=1.',
          'Empieza con U y tiene 5 letras.',
          'Va junto a SELECT en muchos ejemplos.'
        ]
      },
      {
        id: 6,
        title: 'Nivel B: por tiempo',
        objective: 'Usar el tiempo de respuesta para validar inyeccion.',
        open: 'Lee la pregunta del mini ejercicio.',
        observe: 'Que un retraso de respuesta puede confirmar una SQLi.',
        deliver: 'Responde, comprueba y valida la flag en el formulario.',
        challenge: 'Si confirmas SQLi comparando retraso de respuesta, es SQLi por...',
        sampleAnswer: 'tiempo',
        answer: 'tiempo',
        steps: [
          'Piensa en dos respuestas con distinto tiempo.',
          'Responde el mini ejercicio.',
          'Valida la flag cuando aparezca.'
        ],
        hints: [
          'La palabra es corta.',
          'Tambien se dice SQLi "time-based".',
          'En espanol, se refiere al reloj/espera.'
        ]
      }
    ]
  },
  {
    slug: 'xss',
    title: 'Cross-Site Scripting',
    intro: 'Practica como un texto puede convertirse en codigo dentro del navegador.',
    levels: [
      {
        id: 7,
        title: 'Nivel A: texto que se interpreta',
        objective: 'Ver si la app interpreta HTML enviado por el usuario.',
        open: 'Lee el mini ejercicio de esta tarjeta.',
        observe: 'Que innerHTML interpreta etiquetas en vez de mostrarlas como texto.',
        deliver: 'Escribe la respuesta, comprueba y valida la flag.',
        challenge: '¿Que tipo de XSS se ejecuta cuando inyectas codigo en la URL y aparece directamente en la pagina?',
        sampleAnswer: 'reflected',
        answer: 'reflected',
        steps: [
          'Lee la diferencia entre texto y HTML interpretado.',
          'Responde el mini ejercicio.',
          'Valida la flag obtenida.'
        ],
        hints: [
          'La palabra es "Reflected".',
          'Completa: XSS ________.',
          'Mira el titulo del mini desafio.'
        ]
      },
      {
        id: 8,
        title: 'Nivel B: evento sencillo',
        objective: 'Ejecutar una accion simple usando un evento HTML.',
        open: 'Lee la pregunta del mini ejercicio.',
        observe: 'Que ciertos eventos HTML pueden ejecutar codigo.',
        deliver: 'Responde, comprueba y valida la flag.',
        challenge: '¿Cual es el tipo de XSS donde el navegador ejecuta codigo malicioso sin que el servidor participe?',
        sampleAnswer: 'dom-based',
        answer: 'dom-based',
        steps: [
          'Lee el ejemplo de evento comun.',
          'Responde el mini ejercicio.',
          'Valida la flag para continuar.'
        ],
        hints: [
          'Empieza con "DOM".',
          'Completa: DOM-________.',
          'Mira el titulo del mini desafio.'
        ]
      }
    ]
  }
];

module.exports = {
  WARMUP_SECTIONS
};
