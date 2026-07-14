# 🗺️ Galicia · Nuestro viaje

Planner colaborativo para vuestro viaje a Galicia (del **15 al 20 de julio de 2026**,
vuelo de vuelta el 21), con base en el NH Collection Santiago de Compostela.
Los dos abrís la misma URL desde el móvil, marcáis paradas como hechas cada uno por
separado, dejáis notas compartidas, pegáis fotos/enlaces y podéis añadir y reordenar
paradas. Todo se guarda en el servidor y se sincroniza al abrir o refrescar.

Cada día muestra su fecha real y hay una cuenta atrás para el viaje. Las paradas están
marcadas por prioridad (imperdible / recomendable / opcional) y podéis filtrar para ver
solo lo imperdible.

## 🚗 Coche: solo sábado 18 y domingo 19

El coche se recoge el sábado 18 (09-10h) y se devuelve el lunes 20 (09-10h), así que
el plan concentra la naturaleza en coche en esos dos días:

- **Sábado 18 — Costa da Morte + Fisterra** (por libre, a vuestro ritmo): Ponte Maceira,
  cabo Fisterra, cascada de Ézaro y, de noche, el **Ézaro iluminado** (solo sábados de
  julio, 23:00-00:00).
- **Domingo 19 — Rías Baixas**: Cambados, bodega de Albariño, comida top en Casa Solla
  (Poio) y Combarro.

**Viernes 17** y **lunes 20** son días a pie por Santiago (el viernes, con opción de
excursión en bus a otra zona; el lunes se devuelve el coche por la mañana).

Muros-Carnota y la Ribeira Sacra quedan en "Ideas extra" por si ampliáis el alquiler.

## 🍽️ Las dos comidas top

Los lunes cierra casi toda la alta cocina gallega, así que las dos experiencias top van
en días que abren:

- **Casa Marcelo** (1★, Santiago) — cena, miércoles 15. Ojo: no reservan para menos de
  8; hay que ir en persona a las 20:30 y coger turno.
- **Casa Solla** (1★, Poio) — comida, domingo 19. Reservad en restaurantesolla.com.

---

## 🚂 Desplegar en Railway (paso a paso)

### 1. Subir el proyecto a GitHub
Crea un repositorio nuevo en GitHub y sube esta carpeta. Desde la terminal:

```bash
cd galicia-app
git init
git add .
git commit -m "Galicia planner"
git branch -M main
git remote add origin https://github.com/TU_USUARIO/galicia-app.git
git push -u origin main
```

### 2. Crear el proyecto en Railway
1. Entra en [railway.app](https://railway.app) y pulsa **New Project**.
2. Elige **Deploy from GitHub repo** y selecciona tu repositorio.
3. Railway detectará Node automáticamente y empezará a construir.

### 3. ⚠️ Añadir un volumen (IMPRESCINDIBLE)
Sin esto, la base de datos se borraría cada vez que se redespliega la app.

1. En tu servicio, ve a la pestaña **Variables** → **Volumes** (o botón **+ Volume**).
2. Crea un volumen con **Mount path**: `/data`
3. Guarda. Railway reiniciará el servicio.

La app detecta automáticamente `/data` y guarda ahí `galicia.db`. Si no existe (por
ejemplo en local), usa la carpeta `./data` del proyecto.

### 4. Generar el dominio público
1. Ve a **Settings** → **Networking** → **Generate Domain**.
2. Railway te dará una URL tipo `https://galicia-app-production.up.railway.app`.
3. **Esa es vuestra URL.** Abridla los dos en el móvil y guardadla en favoritos o
   como acceso directo en la pantalla de inicio.

¡Listo! 🎉

---

## 📱 Añadir a la pantalla de inicio (como una app)

- **iPhone (Safari):** abre la URL → botón compartir → "Añadir a pantalla de inicio".
- **Android (Chrome):** abre la URL → menú (⋮) → "Añadir a pantalla principal".

Así tendréis un icono como si fuera una app nativa.

---

## 🧑‍🤝‍🧑 Cómo funciona la colaboración

- Al entrar, cada uno elige quién es (Persona A o B). Podéis poner vuestros nombres
  reales en "Cambiar nombres".
- Cada parada tiene **dos botones de "hecho"**, uno por persona. Cuando los dos la
  marcáis, la tarjeta se pone en verde.
- Las **notas** y las **fotos/enlaces** son compartidas: lo que añade uno lo ve el otro.
- Los cambios se sincronizan **al abrir o refrescar** la página (no es tiempo real
  instantáneo tipo Google Docs, pero para un viaje va de sobra).

> Nota: la elección de quién eres y los nombres se guardan en cada móvil. El resto
> (paradas, marcas, notas, fotos) se guarda en el servidor y es común a los dos.

---

## 🛠️ Probar en local (opcional)

Necesitas Node 18 o superior:

```bash
cd galicia-app
npm install
npm start
```

Abre `http://localhost:3000`. En local la base de datos se crea en `./data/galicia.db`.

---

## 🔄 Reiniciar el itinerario desde cero

Si alguna vez queréis volver a cargar el itinerario original (borrando marcas, notas
y cambios), borrad el archivo `galicia.db` del volumen y reiniciad el servicio. El
seed se volverá a ejecutar la próxima vez que arranque.

---

## 📂 Qué hay dentro

- `server.js` — servidor Express + base de datos SQLite y la API.
- `seed.js` — el itinerario completo de los 7 días (aquí podéis tocar textos).
- `public/` — la app que se ve en el móvil (HTML, CSS y JavaScript).
- `railway.json` — configuración de arranque para Railway.

Para cambiar textos del itinerario, editad `seed.js` **antes** del primer despliegue.
Una vez desplegado, los cambios de contenido mejor hacedlos desde la propia app
(botón editar en cada parada), porque el seed solo se ejecuta la primera vez.
