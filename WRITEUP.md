# Write-up Mini CTF Academia

Este documento resume como correr, jugar y explicar el laboratorio CTF web de 5 niveles.

## 0) Estructura profesional del proyecto

```text
lab-ctf/
	src/
		app.js
		server.js
		config/
			index.js
			flags.js
		middleware/
			requireLevel.js
		routes/
			web.js
		utils/
			cookies.js
			progress.js
	niveles/
		nivel1/
		nivel2/
		nivel3/
		nivel4/
		nivel5/
	public/
		styles.css
	views/
		home.html
	.env.example
	server.js
	package.json
```

- El archivo raiz server.js queda como entrada simple.
- La logica queda separada por responsabilidad en src/.

## 1) Como levantar el laboratorio

1. Abrir terminal en la carpeta del proyecto.
2. Instalar dependencias:

```bash
npm install
```

3. Iniciar servidor:

```bash
npm start
```

Modo desarrollo (auto-recarga):

```bash
npm run dev
```

Variables de entorno opcionales:

- PORT (por defecto 3000)
- CTF_SECRET (firma del progreso)

4. Abrir en navegador:

http://localhost:3000

## 2) Flujo general del CTF

- El alumno empieza en la pagina principal.
- Debe resolver los niveles en orden.
- Cada nivel tiene un formulario para validar su flag.
- El servidor guarda progreso en cookie firmada y desbloquea el siguiente nivel.
- Si intentan saltar cambiando URL, el servidor responde Acceso bloqueado (403).

## 3) Resolucion por niveles

### Nivel 1 - Leer con atencion

Ruta:

- /nivel1/

Pista visible:

- El secreto puede no estar en la pagina.

Pista escondida:

- Comentario HTML sugiere buscar archivo en el mismo directorio.

Resolucion:

1. Abrir /nivel1/pista.txt
2. Copiar flag encontrada.
3. Validarla en el formulario del nivel 1.

Flag:

- ACADEMIA{miraste_mas_alla}

### Nivel 2 - Ruta escondida

Ruta:

- /nivel2/

Pista visible:

- Pensar en nombres clasicos de carpetas ocultas.

Pista escondida:

- Comentario HTML sugiere /nivel2/oculto/

Resolucion:

1. Abrir /nivel2/oculto/clave.txt
2. Copiar flag.
3. Validarla en el formulario del nivel 2.

Flag:

- ACADEMIA{las_rutas_tambien_hablan}

### Nivel 3 - Mensaje codificado

Ruta:

- /nivel3/

Pista visible:

- Revisar scripts y consola del navegador.

Pista escondida:

- En codigo.js hay un Base64.

Resolucion:

1. Abrir /nivel3/codigo.js o consola del navegador.
2. Decodificar:

RmxhZzogQUNBREVNSUF7ZWxfY29kaWdvX3RhbWJpZW5fZXNfcGlzdGF9

3. Resultado:

Flag: ACADEMIA{el_codigo_tambien_es_pista}

4. Validar en formulario del nivel 3.

### Nivel 4 - Unir fragmentos

Ruta:

- /nivel4/

Pista visible:

- Primer fragmento en la pagina: ACADEMIA{une_

Pista escondida:

- Comentario HTML sugiere /nivel4/recursos/fragmento.txt

Resolucion:

1. Abrir /nivel4/recursos/fragmento.txt
2. Unir:

ACADEMIA{une_ + fragmentos_y_gana}

3. Flag completa:

ACADEMIA{une_fragmentos_y_gana}

4. Validar en formulario del nivel 4.

### Nivel 5 - Cierre final

Ruta:

- /nivel5/

Pista visible:

- Donde suelen terminar las historias.

Resolucion:

1. Abrir /nivel5/final.txt
2. Copiar la flag final.
3. Validar en formulario del nivel 5.

Flag final:

- ACADEMIA{ctf_completado}

## 4) Que se aprende en cada nivel

- Nivel 1: observacion y lectura de estructura.
- Nivel 2: deduccion de rutas y exploracion de directorios.
- Nivel 3: analisis de scripts y decodificacion basica.
- Nivel 4: correlacion de pistas y reconstruccion de datos.
- Nivel 5: interpretacion de acertijos y cierre del flujo.

## 5) Nota tecnica de seguridad del laboratorio

- Este CTF es educativo y local.
- No busca simular un entorno real ofensivo.
- El bloqueo por nivel se hace en servidor para evitar bypass simple por URL.
- El progreso se guarda en cookie firmada para evitar manipulacion trivial.

## 6) Sugerencia para clase

Secuencia recomendada:

1. Presentar historia y objetivo.
2. Resolver nivel 1 en vivo.
3. Dejar nivel 2 y 3 al grupo.
4. Resolver nivel 4 en conjunto.
5. Usar nivel 5 como cierre/competencia corta.

Frase de inicio sugerida:

Hoy no venimos solo a mirar una pagina web: venimos a pensar como analistas. En un CTF, cada detalle puede ser una pista, cada archivo puede hablar y cada error de observacion puede costarte una bandera.