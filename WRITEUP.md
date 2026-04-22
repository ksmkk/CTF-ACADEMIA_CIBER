# Write-up Warmup Academy (version actual)

Este documento describe la version actual del repositorio: solo warmups guiados.

## 1. Alcance actual

- La app esta centrada en warmups.
- La ruta principal redirige a /warmup/.
- Ya no se publican rutas /nivel1 a /nivel5 en el servidor.
- El flujo de aprendizaje tiene 5 niveles secuenciales.
- Hay una seccion final llamada VALIDADOR para validar la flag final.

## 2. Estructura relevante

- src/app.js
  - Configura Express y publica assets.
  - No monta niveles del CTF principal.
- src/routes/web.js
  - Rutas de warmup y APIs de validacion.
  - Endpoint final: POST /api/warmup/final-validator.
- src/config/warmup.js
  - Define los 5 temas y respuestas de mini retos.
- src/config/flags.js
  - Flags de warmup.
  - Generador de flag final por codigo (sin string final hardcodeada completa).
- views/warmup.html
  - Hub principal de warmups.
  - Seccion VALIDADOR y celebracion.
- public/styles.css
  - Estilo visual global actual.
- public/lab-extras.js
  - Script minimo (sin efectos matrix intrusivos).
- niveles/warmup/
  - nmap/mini1.html
  - lfi/mini1.html
  - bruteforce/mini1.html
  - database/mini1.html
  - privesc/mini1.html

## 3. Flujo de uso

1. Entrar a /warmup/.
2. Resolver y validar cada nivel en orden.
3. Completar los 5 niveles para habilitar VALIDADOR.
4. Ir a VALIDADOR y enviar la flag final.
5. Si es correcta, se activa panel de celebracion (GIF + audio).

## 4. Temario de los 5 warmups

1. Nmap
- Objetivo: reconocer la bandera para deteccion de versiones.

2. LFI
- Objetivo: comprender lectura de archivos locales por ruta insegura.

3. Fuerza Bruta
- Objetivo: entender riesgo de claves comunes en login.

4. Bases de Datos
- Objetivo: ubicar campo sensible en tabla simple.

5. Privilege Esc
- Objetivo: recordar base tecnica del bit SUID.

## 5. VALIDADOR final

- Endpoint: POST /api/warmup/final-validator.
- Requisito: warmup completo.
- Validacion de flag final en backend.
- La flag esperada se construye desde codigos de caracteres, no como cadena completa hardcodeada.

## 6. Multimedia de celebracion

La vista del validador usa estas rutas:

- /public/media/final.gif
- /public/media/final-song.mp3

Notas:

- Si la validacion final es correcta, se muestra el GIF.
- La cancion intenta iniciar desde el segundo 12.
- Si el navegador bloquea autoplay, el usuario puede reproducir desde el control de audio visible.

## 7. Como ejecutar

1. Instalar dependencias:

npm install

2. Levantar servidor:

npm start

3. Desarrollo:

npm run dev

## 8. Variables de entorno

- PORT (default: 3000)
- CTF_SECRET (default: academia-lab-local-2026)

## 9. Estado de seguridad del progreso

- Progreso firmado por cookie en backend.
- Desbloqueo secuencial de warmups.
- Validacion final condicionada a warmup completo.

## 10. Nota para docente

Si deseas cambiar preguntas, respuestas o pistas, los puntos principales son:

- src/config/warmup.js (enunciados y answers)
- niveles/warmup/*/mini1.html (interfaz y textos)
- views/warmup.html (hub y validador)
