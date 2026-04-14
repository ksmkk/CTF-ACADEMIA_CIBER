# Write-up Mini CTF Academia de Ciberseguridad UCN

> Documento de resolución oficial del laboratorio CTF web de 5 niveles.
> Incluye estructura del proyecto, flujo de juego, y resolución paso a paso de cada nivel.

---

## 0) Estructura del proyecto

```text
lab-ctf/
  server.js                  ← Entrada principal (requiere src/server.js)
  package.json
  .env.example
  src/
    server.js                ← Levanta el servidor en PORT (default 3000)
    app.js                   ← Configura Express, middleware y rutas estáticas
    config/
      index.js               ← PORT, SECRET, TOTAL_LEVELS, WARMUP_TOTAL_LEVELS
      flags.js               ← CTF_FLAGS y WARMUP_FLAGS (10 flags de warm-up + 5 CTF)
      warmup.js              ← WARMUP_SECTIONS con los 10 mini-retos
    middleware/
      requireLevel.js        ← Bloquea acceso a nivel si no está desbloqueado
      requireWarmup.js       ← Bloquea acceso al CTF principal si warm-up está pendiente
    routes/
      web.js                 ← Todas las rutas: páginas, APIs de warm-up y CTF
    utils/
      cookies.js             ← Parser de cookies manual
      progress.js            ← Progreso firmado con HMAC-SHA256 en cookie
  niveles/
    nivel1/                  ← CSRF Attack
    nivel2/                  ← Login Débil (sin rate limit)
    nivel3/                  ← SQL Injection no trivial
    nivel4/                  ← DOM XSS
    nivel5/                  ← IDOR con Burp Suite
  public/
    styles.css               ← Diseño dark/cyberpunk con 3 temas (ember, neo, ice)
    lab-extras.js            ← Matrix rain, cycle de temas, sonido de click
    timed-hints.js           ← Sistema de pistas progresivas por tiempo
  views/
    home.html                ← Página principal con progreso
    warmup.html              ← Hub de warm-up (5 secciones)
    warmup-section.html      ← Vista dinámica de cada sección warm-up
```

---

## 1) Cómo levantar el laboratorio

```bash
# 1. Instalar dependencias
npm install

# 2. Modo producción
npm start

# 3. Modo desarrollo (auto-reload)
npm run dev
```

Variables de entorno (opcionales):

| Variable     | Default                    | Descripción                          |
|--------------|----------------------------|--------------------------------------|
| `PORT`       | `3000`                     | Puerto del servidor                  |
| `CTF_SECRET` | `academia-lab-local-2026`  | Llave para firmar cookies de progreso |

Abrir en navegador: **http://localhost:3000**

---

## 2) Flujo general del CTF

```
Inicio (/) → Warm-up Challenges (/warmup/) → 10 mini-retos → CTF Principal (5 niveles)
```

1. El alumno llega a la página principal.
2. **Warm-up obligatorio**: 10 mini-retos, 2 por cada vulnerabilidad del CTF principal. Sin completarlo, el acceso al CTF principal está bloqueado (middleware server-side).
3. Al terminar warm-up, se habilita el botón "Comenzar CTF principal".
4. El CTF principal tiene **5 niveles secuenciales**. Cada nivel requiere encontrar una flag y validarla en el formulario del nivel para desbloquear el siguiente.
5. El progreso se guarda en **cookie firmada con HMAC-SHA256** (`ctf_progress` y `warmup_progress`). Cambiar el valor de la cookie sin conocer el secreto provoca reinicio al nivel 1.

---

## 3) Warm-up Challenges

El warm-up tiene 5 secciones con 2 niveles cada una (10 en total).

| Sección       | Niveles | Tema                  | Respuesta A   | Respuesta B    |
|---------------|---------|-----------------------|---------------|----------------|
| `csrf`        | 1, 2    | CSRF Attack           | `csrf`        | `token`        |
| `login`       | 3, 4    | Login Débil           | `rate limit`  | `debil`        |
| `sqli`        | 5, 6    | SQL Injection         | `union`       | `tiempo`       |
| `xss`         | 7, 8    | Cross-Site Scripting  | `innerhtml`   | `onerror`      |
| `idor`        | 9, 10   | IDOR + Burp Suite     | `idor`        | `autorizacion` |

### Cómo resolver cada mini-reto warm-up

1. Ir a `/warmup/` → elegir sección.
2. Leer la tarjeta del nivel (guía rápida, mini ejercicio, pistas).
3. Escribir la respuesta en el campo y pulsar **"Comprobar respuesta"** → aparece la flag WARMUP{...}.
4. Copiar esa flag y pegarla en el formulario de validación de la misma tarjeta → pulsar **"Validar"**.
5. Se desbloquea el siguiente nivel automáticamente.

---

## 4) CTF Principal — Resolución por niveles

### Nivel 1 — CSRF Attack

**Ruta:** `/nivel1/`  
**Flag:** `ACADEMIA{csrf_cambio_sin_consentimiento}`

#### Concepto

**Cross-Site Request Forgery (CSRF)**: un sitio malicioso fuerza al navegador de la víctima (que tiene sesión activa en la banca) a realizar una petición no autorizada hacia el servidor vulnerable, sin que la víctima lo sepa ni lo confirme.

#### Recursos del nivel

- `/nivel1/transfer.html` — Banca vulnerable (sin token CSRF ni verificación de origen).
- `/nivel1/attacker.html` — Página del atacante que lanza la transferencia fraudulenta.
- `/nivel1/backup/admin-notes.txt` — Nota interna que confirma la ausencia de protección.
- `/nivel1/pista.txt` — Guía de pasos para el instructor.
- `/nivel1/robots.txt` — Menciona `/nivel1/attacker.html` como página a no indexar (pista de reconocimiento).

#### Resolución paso a paso

1. Abrir `/nivel1/transfer.html` en el navegador (simula la sesión activa de la víctima).
2. Observar que el formulario no valida ningún origen ni incluye token CSRF.
3. En la misma sesión del navegador, abrir `/nivel1/attacker.html`.
4. Pulsar el botón **"Lanzar ataque CSRF"**.
   - Esto redirige a `/nivel1/transfer.html?to=cuenta_atacante&amount=50000&origin=evil`.
   - El script de `transfer.html` detecta los parámetros en la URL y ejecuta automáticamente la transferencia vía `fetch()`.
5. El servidor recibe la petición POST a `/api/ctf/nivel1/transfer` con los parámetros del atacante.
6. La condición del servidor se cumple: `to === 'cuenta_atacante' && amount === '50000' && origin === 'evil'`.
7. Aparece la **flag** en pantalla: `ACADEMIA{csrf_cambio_sin_consentimiento}`.
8. Copiar la flag y pegarla en el formulario de validación de `/nivel1/`.

#### Por qué funciona

El endpoint `/api/ctf/nivel1/transfer` acepta peticiones POST con `application/x-www-form-urlencoded` sin validar el encabezado `Origin` ni requerir un token de sesión en el cuerpo. Cualquier página (incluida una página atacante en el mismo servidor) puede construir y enviar esa petición reutilizando las cookies del navegador.

#### Protección real

- Agregar un **token CSRF** (valor aleatorio por sesión) en cada formulario y validarlo en el servidor.
- Verificar el encabezado `Origin` o `Referer` en peticiones de estado mutante.
- Usar cookies con atributo `SameSite=Strict`.

---

### Nivel 2 — Login Débil (sin rate limit)

**Ruta:** `/nivel2/`  
**Flag:** `ACADEMIA{login_sin_rate_limit}`

#### Concepto

**Autenticación débil + ausencia de rate limit**: el sistema de login usa un PIN de 4 dígitos y no bloquea la cuenta ni limita los intentos. Esto hace trivial un ataque de **fuerza bruta** (probar todos los valores posibles: 0000–9999).

#### Recursos del nivel

- `/nivel2/pin-login.html` — Panel de login con campo PIN.
- `/nivel2/auth/pin-hint.txt` — Archivo de soporte legacy que filtra el PIN por defecto.
- `/nivel2/oculto/clave.txt` — Recurso legacy (ya no contiene la flag, pero es un archivo de reconocimiento).

#### Resolución paso a paso

**Opción A — Reconocimiento de archivos expuestos (recomendada para clase)**

1. Ir a `/nivel2/auth/pin-hint.txt`.
2. Leer el contenido: `PIN por defecto del supervisor: 0000`.
3. Ir a `/nivel2/pin-login.html`, ingresar `0000` y pulsar **"Validar PIN"**.
4. La respuesta del servidor es `{ solved: true, flag: "ACADEMIA{login_sin_rate_limit}" }`.
5. Aparece la flag en pantalla → copiar y validar en `/nivel2/`.

**Opción B — Fuerza bruta manual / scriptada**

```bash
# Ejemplo con curl (requiere tener las cookies de warm-up completado)
for pin in $(seq -w 0 9999); do
  result=$(curl -s -X POST http://localhost:3000/api/ctf/nivel2/pin \
    -H "Content-Type: application/x-www-form-urlencoded" \
    --cookie "COOKIE_AQUI" \
    -d "pin=$pin")
  if echo "$result" | grep -q '"solved":true'; then
    echo "PIN encontrado: $pin"
    echo "$result"
    break
  fi
done
```

El PIN correcto es **`0000`** (valor por defecto de sistema legacy sin cambiar).

#### Por qué funciona

El endpoint `/api/ctf/nivel2/pin` no implementa:
- Límite de intentos por IP o por usuario (rate limit).
- Bloqueo temporal de cuenta tras N intentos fallidos.
- CAPTCHA ni ningún mecanismo anti-automatización.

Cualquier script puede hacer 10.000 peticiones en segundos hasta dar con el PIN correcto.

#### Protección real

- Implementar **rate limiting** (ej. máximo 5 intentos por IP en 15 minutos).
- Bloquear temporalmente la cuenta tras intentos fallidos.
- Usar contraseñas largas (mínimo 12 caracteres) en vez de PINs de 4 dígitos.
- Agregar autenticación multifactor (MFA/2FA).

---

### Nivel 3 — SQL Injection no trivial

**Ruta:** `/nivel3/`  
**Flag:** `ACADEMIA{sqli_union_supero_control}`

#### Concepto

**SQL Injection avanzada**: el formulario de login es vulnerable a inyección SQL, pero filtra el payload clásico `OR 1=1`. El reto consiste en usar una variante más avanzada:

- `UNION SELECT` — para unir resultados de consultas.
- `SLEEP()` / `WAITFOR DELAY` — SQLi basada en tiempo (time-based blind).
- `EXTRACTVALUE()` / `information_schema` — técnicas de error-based o enumeración.
- Combinación de `--` comentario + comilla `'`.

#### Recursos del nivel

- `/nivel3/sqli.html` — Formulario de login vulnerable.
- `/nivel3/codigo.js` — Script con pistas en consola del navegador.
- `/nivel3/busqueda.html` — Redirección al simulador SQLi.

#### Resolución paso a paso

1. Abrir `/nivel3/sqli.html`.
2. En el campo **Email** o **Password**, ingresar un payload SQLi avanzado. Ejemplos válidos:

   **Opción A — UNION SELECT:**
   ```
   Email:    ' UNION SELECT 1,2,3 --
   Password: cualquier cosa
   ```

   **Opción B — Time-based (SLEEP):**
   ```
   Email:    admin@test.com
   Password: ' OR SLEEP(5) --
   ```

   **Opción C — Comilla + comentario:**
   ```
   Email:    admin'--
   Password: ' OR 1=1--
   ```

   **Opción D — EXTRACTVALUE:**
   ```
   Email:    ' AND EXTRACTVALUE(1, CONCAT(0x7e, (SELECT version()))) --
   Password: test
   ```

3. Pulsar **"Ingresar"**.
4. El formulario detecta en frontend que el payload parece SQLi avanzada y llama al backend.
5. El servidor verifica los patrones: `union select`, `sleep(`, `waitfor delay`, `extractvalue(`, `information_schema`, o combinación `--` + `'`.
6. Si cumple, responde: `{ solved: true, flag: "ACADEMIA{sqli_union_supero_control}" }`.
7. Copiar la flag y validarla en `/nivel3/`.

#### Mecanismo de validación del servidor

```javascript
// src/routes/web.js — endpoint /api/ctf/nivel3/sqli
const looksLikeAdvancedSqli =
  payload.includes('union select') ||
  payload.includes('sleep(') ||
  payload.includes('waitfor delay') ||
  payload.includes('extractvalue(') ||
  payload.includes('information_schema') ||
  (payload.includes('--') && payload.includes("'"));
```

El payload más simple que activa la flag es ingresar `' UNION SELECT 1--` en cualquier campo.

#### Por qué funciona

En un backend real, si las consultas SQL se construyen concatenando strings sin prepared statements, un payload `UNION SELECT` puede inyectarse en la consulta y devolver filas arbitrarias. En este simulador, el servidor detecta los patrones característicos de SQLi avanzada para simular ese comportamiento.

#### Protección real

- Usar **Prepared Statements / Parameterized Queries** en todas las consultas.
- Nunca concatenar input del usuario directamente en SQL.
- Implementar un WAF (Web Application Firewall) como capa adicional.
- Principio de mínimo privilegio: el usuario de BD solo tiene los permisos necesarios.

---

### Nivel 4 — DOM XSS

**Ruta:** `/nivel4/`  
**Flag:** `ACADEMIA{xss_dom_controlado}`

#### Concepto

**DOM-based Cross-Site Scripting**: la aplicación toma un valor del usuario (parámetro de URL) y lo inyecta directamente en `innerHTML` sin sanitizar, permitiendo ejecutar JavaScript arbitrario en el navegador de la víctima.

#### Resolución paso a paso

1. Ir a `/nivel4/reviews.html`.
2. En el campo **Review**, ingresar un payload XSS con `onerror`:
   ```html
   <img src=x onerror="window.__xssDone=true">
   ```
3. Pulsar **"Previsualizar"** — el script cambia la URL a `?review=<img...>`.
4. La página recarga y ejecuta `preview.innerHTML = 'Review recibida: ' + review`.
5. El `onerror` se dispara porque `src=x` no existe → `window.__xssDone = true`.
6. Pulsar **"Verificar explotación XSS"**.
7. El frontend manda `executed=true` al endpoint `/api/ctf/nivel4/xss-check`.
8. Aparece la flag: `ACADEMIA{xss_dom_controlado}`.

---

### Nivel 5 — IDOR con Burp Suite

**Ruta:** `/nivel5/`  
**Flag:** `ACADEMIA{idor_repeater_master}`

#### Concepto

**Insecure Direct Object Reference (IDOR)**: la API expone objetos por ID numérico sin verificar si el usuario autenticado es el propietario. Cambiando el `orderId` se pueden ver órdenes de otros usuarios, incluyendo una orden interna con la flag.

#### Resolución paso a paso

1. Ir a `/nivel5/orders.html?orderId=1001` — ver orden normal.
2. Cambiar el parámetro: probar `?orderId=1002`, luego `?orderId=1337`.
3. Con `orderId=1337` la API devuelve la orden interna:
   ```json
   {
     "owner": "admin.root",
     "status": "Interna",
     "note": "Referencia interna: ACADEMIA{idor_repeater_master}"
   }
   ```
4. Copiar la flag de la nota y validarla en `/nivel5/`.

**Con Burp Suite Repeater:**
1. Interceptar la petición GET a `/api/ctf/nivel5/orders?orderId=1001`.
2. En el Repeater, cambiar `orderId=1001` → `1337` y enviar.
3. Ver la respuesta con la flag en el campo `note`.

---

## 5) Tabla resumen de flags

| Nivel | Vuln               | Flag                                     |
|-------|--------------------|------------------------------------------|
| 1     | CSRF Attack        | `ACADEMIA{csrf_cambio_sin_consentimiento}` |
| 2     | Login Débil        | `ACADEMIA{login_sin_rate_limit}`         |
| 3     | SQL Injection      | `ACADEMIA{sqli_union_supero_control}`    |
| 4     | DOM XSS            | `ACADEMIA{xss_dom_controlado}`           |
| 5     | IDOR               | `ACADEMIA{idor_repeater_master}`         |

---

## 6) Nota técnica de seguridad del laboratorio

- **Progreso en cookies firmadas**: el progreso se firma con HMAC-SHA256 usando la variable `CTF_SECRET`. Manipular el valor de la cookie sin la clave secreta reinicia el progreso al nivel 1.
- **Control server-side por nivel**: el middleware `requireLevel(n)` y `requireWarmup` bloquean el acceso estático a carpetas de niveles no habilitados. No es posible bypassear saltando directamente a la URL del nivel.
- **Warm-up obligatorio**: sin completar el warm-up, el CTF principal permanece bloqueado a nivel de servidor (no solo de UI).
- **Este CTF es educativo y local**: no simula un entorno ofensivo real. Las vulnerabilidades son intencionadas y controladas para fines pedagógicos.

---

## 7) Bugs corregidos en esta versión

| Archivo                          | Problema                                               | Corrección                         |
|----------------------------------|--------------------------------------------------------|------------------------------------|
| `niveles/nivel3/busqueda.html`   | Redirigía a `/nivel4/reviews.html` (bypass de nivel)  | Redirige a `/nivel3/sqli.html`     |
| `niveles/nivel4/perfil.html`     | Redirigía a `/nivel5/orders.html` (bypass de nivel)   | Redirige a `/nivel4/reviews.html`  |
| `WRITEUP.md`                     | Contenido de CTF antiguo con flags erróneas            | Reescrito para CTF actual          |

---

## 8) Guía para el instructor — Sugerencia de clase

| Paso | Actividad                                                             |
|------|-----------------------------------------------------------------------|
| 1    | Presentar la plataforma y el objetivo del CTF                        |
| 2    | Guiar el warm-up en vivo (sección CSRF, primera tarjeta)              |
| 3    | Dejar que los alumnos completen el warm-up de forma autónoma          |
| 4    | Resolver Nivel 1 (CSRF) en vivo como demostración                    |
| 5    | Nivel 2 (Login Débil): pedir reconocimiento + fuerza bruta opcional   |
| 6    | Nivel 3 (SQLi): mostrar el concepto de payload, dejar que exploren    |
| 7    | Niveles 4 y 5: resolver en conjunto o usar como competencia corta     |

**Frase de inicio sugerida:**

> *"Hoy no venimos solo a mirar una página web: venimos a pensar como analistas. En un CTF, cada detalle puede ser una pista, cada archivo puede hablar y cada error de observación puede costarte una bandera."*