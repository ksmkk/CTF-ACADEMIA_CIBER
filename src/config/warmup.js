const WARMUP_SECTIONS = [
  {
    slug: 'nmap',
    title: 'Nmap',
    intro: 'Mini reto guiado para recordar la bandera de Nmap que detecta versiones de servicios.',
    levels: [
      {
        id: 1,
        title: 'Nivel 1: Deteccion de servicios',
        objective: 'Identificar la opcion de Nmap para detectar versiones de servicios.',
        open: 'Lee el ejemplo del comando y prueba la pregunta de validacion.',
        observe: 'Que no es lo mismo detectar puertos abiertos que detectar versiones.',
        deliver: 'Responde con la bandera correcta, obten la flag y validala abajo.',
        challenge: '¿Que opcion de Nmap detecta versiones de servicios?',
        sampleAnswer: '-sV',
        answer: 'sv',
        steps: [
          'Compara un escaneo basico con uno de version.',
          'Responde el mini ejercicio.',
          'Valida la flag para desbloquear el siguiente nivel.'
        ],
        hints: [
          'Empieza con la letra s.',
          'Se usa junto con -p o -sS en muchos ejemplos.',
          'La v va en mayuscula en la documentacion oficial.'
        ]
      }
    ]
  },
  {
    slug: 'lfi',
    title: 'LFI',
    intro: 'Mini reto guiado para entender lectura de archivos locales en parametros inseguros.',
    levels: [
      {
        id: 2,
        title: 'Nivel 2: Lectura local',
        objective: 'Reconocer que archivo sencillo puede usarse para demostrar un LFI basico.',
        open: 'Observa el ejemplo de ruta vulnerable y responde la pregunta.',
        observe: 'Que un parametro file= permite salir del directorio esperado.',
        deliver: 'Responde con la extension pedida, recibe la flag y validala abajo.',
        challenge: '¿Cual es la extension del archivo ayuda.txt que se muestra en el ejemplo?',
        sampleAnswer: 'txt',
        answer: 'txt',
        steps: [
          'Revisa el ejemplo de traversal.',
          'Responde el mini ejercicio.',
          'Valida la flag para pasar al nivel 3.'
        ],
        hints: [
          'Es una extension muy comun de archivo plano.',
          'Tiene tres letras.',
          'Termina en t.'
        ]
      }
    ]
  },
  {
    slug: 'bruteforce',
    title: 'Fuerza Bruta',
    intro: 'Mini reto guiado para ver por que contrasenas comunes caen rapido en ataques automaticos.',
    levels: [
      {
        id: 3,
        title: 'Nivel 3: Password comun',
        objective: 'Entender por que usar claves comunes facilita un ataque de fuerza bruta.',
        open: 'Mira la lista de passwords mas usados y responde la pregunta.',
        observe: 'Que los atacantes prueban primero patrones conocidos.',
        deliver: 'Escribe la clave pedida, obten la flag y validala abajo.',
        challenge: '¿Que password comun se usa en este mini reto como ejemplo principal?',
        sampleAnswer: 'admin',
        answer: 'admin',
        steps: [
          'Haz el intento en el demo de login.',
          'Responde la pregunta de validacion.',
          'Valida la flag para abrir el nivel 4.'
        ],
        hints: [
          'Es una palabra corta muy usada por defecto.',
          'Muchas instalaciones viejas la dejan tal cual.',
          'Tiene cinco letras.'
        ]
      }
    ]
  },
  {
    slug: 'database',
    title: 'Bases de Datos',
    intro: 'Mini reto guiado para ubicar la flag como un campo dentro de una tabla simple.',
    levels: [
      {
        id: 4,
        title: 'Nivel 4: Campo objetivo',
        objective: 'Reconocer en que campo de una tabla se almacena la flag del reto.',
        open: 'Lee la tabla de ejemplo y responde la pregunta.',
        observe: 'Que la flag no esta en id ni en username, sino en una columna dedicada.',
        deliver: 'Escribe el nombre de la columna, recibe la flag y validala.',
        challenge: '¿Como se llama la columna marcada como dato sensible?',
        sampleAnswer: 'dato_sensible',
        answer: 'datosensible',
        steps: [
          'Observa las columnas de la tabla.',
          'Identifica donde esta el valor sensible.',
          'Valida la flag para llegar al ultimo nivel.'
        ],
        hints: [
          'Es una columna compuesta por dos palabras.',
          'Comienza con dato.',
          'La segunda palabra es sensible.'
        ]
      }
    ]
  },
  {
    slug: 'privesc',
    title: 'Privilege Esc',
    intro: 'Mini reto guiado para recordar la base tecnica del bit SUID en Linux.',
    levels: [
      {
        id: 5,
        title: 'Nivel 5: Bit SUID',
        objective: 'Entender que valor representa el bit SUID en permisos especiales.',
        open: 'Lee el resumen de SUID y responde la pregunta final.',
        observe: 'Que el bit SUID permite ejecutar binarios con privilegios del owner.',
        deliver: 'Responde con el valor correcto, obten la flag y termina el warmup.',
        challenge: '¿Como se llama normalmente los privilegios especiales?',
        sampleAnswer: 'root',
        answer: 'root',
        steps: [
          'Revisa el ejemplo de permisos especiales.',
          'Responde la pregunta tecnica.',
          'Valida la ultima flag para completar el warmup.'
        ],
        hints: [
          'Es un valor de cuatro digitos.',
          'Empieza con 4.',
          'Se combina con permisos como 755 o 4755.'
        ]
      }
    ]
  }
];

module.exports = {
  WARMUP_SECTIONS
};
