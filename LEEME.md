# Inventario de flota

Aplicación web (PWA) para controlar existencias de la base OQA6.

## Funciones

- **Reponer material:** suma hasta ocho materiales de una vez a la Cantidad (stock cerrado).
- **Registrar gasto:** resta unidades y permite indicar una matrícula opcional. Solo admite repuestos y consumibles (las herramientas no se "gastan").
  - En aceite, anticongelante, líquido de frenos, limpiaparabrisas, disolvente, agua destilada, pulimento y WD40 (los que llevan envase), primero se descuenta de lo que ya está abierto y, si no llega, se abre lo que haga falta de Cantidad. El contador "Abierto" nunca pasa de 1: indica si hay o no un envase en uso ahora mismo. El campo "Gasto" de los consumibles ya NO se toca automáticamente al registrar un gasto (solo cambian Cantidad/Abierto); si quieres usarlo como nota propia, edítalo a mano desde "Editar producto".
  - En el resto de consumibles (bombillas, cinta, mechas, grapas...) el gasto resta directamente de Cantidad, sin usar "Abierto".
  - En repuestos, si no queda stock suficiente, el gasto se registra igualmente y el Total puede quedar en negativo (por ejemplo, al quitarle el cristal a un espejo completo para reponerlo en otra furgoneta) hasta que se repone.
- **Nuevo producto:** botón "＋ Nuevo producto" en la pantalla de Inventario, para dar de alta a mano un material que no estuviera en la lista (nombre, grupo y cantidad inicial). Si es un consumible de tipo líquido/envase, marca la casilla correspondiente para que el gasto se comporte como con el aceite.
- **Repuestos por pedir:** solo avisa de repuestos nuevos cuando quedan 0 o 1 unidades. Los dañados, de desguace y protectores laterales no generan avisos ni peticiones. Además, cualquier repuesto se puede excluir a mano desde "Editar producto" marcando "No incluir en peticiones de repuestos nuevos" (útil para piezas que ya no se van a volver a pedir sueltas porque las sustituye otro modelo).
- **Exportar Excel:** descarga el inventario completo —material, productos y herramientas— conservando las columnas `Cantidad`, `Gasto`, `Usado/Abierto` y `Total`. Al final incluye solo los materiales gastados que llevan matrícula. La exportación cierra la semana de repuestos: descuenta su gasto de `Cantidad` y reinicia esa columna a cero (esto solo afecta a repuestos; en consumibles, `Gasto` es un histórico acumulado informativo que no se resetea).

La pantalla se adapta automáticamente a móvil y a escritorio.

## Datos compartidos entre todos los móviles (Firebase)

Los datos ya no se guardan solo en el navegador de cada móvil: si se configura Firebase, todos los dispositivos ven y actualizan el mismo inventario en tiempo real. Pasos:

1. Entra en <https://console.firebase.google.com> y crea un proyecto gratis.
2. En el menú lateral, "Compilación" → "Realtime Database" → "Crear base de datos" (elige la región más cercana y modo de prueba).
3. En la pestaña "Reglas" de esa base de datos, pon:
   ```json
   { "rules": { ".read": true, ".write": true } }
   ```
   (Sencillo, sin cuentas de Firebase — la app ya tiene su propio usuario/contraseña de acceso.)
4. Icono de engranaje → "Configuración del proyecto" → baja hasta "Tus apps" → icono web `</>` → registra una app → copia el objeto de configuración.
5. Abre `app.js`, busca `const firebaseConfig = {...}` al principio del archivo y sustituye los valores de ejemplo por los tuyos.
6. Sube los archivos actualizados a tu alojamiento. A partir de ese momento, cualquier móvil que abra la app comparte el mismo inventario al instante.

Si no se rellena `firebaseConfig`, la app sigue funcionando igual que antes: cada móvil guarda sus propios datos en local.

## Dónde alojarla

Para tener siempre acceso a los archivos y poder tocarlos con libertad, se recomienda GitHub Pages (gratis, con HTTPS incluido —necesario para que funcione como PWA— y con los archivos siempre disponibles en tu propio repositorio). Cloudflare Pages o Vercel son alternativas equivalentes.

Cada vez que subas cambios de código, sube también `sw.js` con el número de `CACHE` incrementado (por ejemplo `inventario-flota-v5`), para que a todo el mundo le llegue la versión nueva sin tener que borrar datos del navegador.

## Abrirla en móvil

Publica el contenido de esta carpeta en tu alojamiento (HTTPS) y abre la dirección en el móvil. Desde el menú del navegador se podrá usar "Añadir a pantalla de inicio" para que aparezca como una app.
