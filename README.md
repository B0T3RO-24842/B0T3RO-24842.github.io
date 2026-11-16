# Portafolio

Sitio personal que se arma solo a partir de los repositorios de GitHub.

## Agregar o actualizar un proyecto

No se toca este código. En el repositorio del proyecto, en GitHub:

1. Ponle el topic `portfolio` para que aparezca.
2. Ponle también `featured` si debe ir primero, en la tarjeta grande.
3. Escribe la descripción y los topics de tecnología: salen tal cual en la tarjeta.
4. Si tiene demo, pon la URL en "Website": aparece el botón **Probar aquí**.
5. Opcional: sube una captura en `docs/cover.png` para la portada.

El sitio se reconstruye solo cada día. Para verlo ya: pestaña Actions → "Publicar portafolio" → Run workflow.

Mientras ningún repositorio tenga `portfolio`, se muestran todos los propios.

## Datos personales

Nombre, rol, bio y enlaces están en `site.config.ts`.

## Desarrollo

```bash
npm install
npm run dev
```

`npm test` prueba la regla de qué repositorios se muestran y en qué orden.

**Stack:** Next.js 16 (exportación estática), React 19, TypeScript, Tailwind CSS 4, GitHub Pages.
