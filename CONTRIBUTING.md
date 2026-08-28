# Contribuir a AussieCare

Gracias por mejorar AussieCare. El proyecto prioriza exactitud, accesibilidad, rendimiento móvil y reversibilidad de la película.

## Preparación

1. Usa Node.js 22.13 o superior.
2. Ejecuta `npm ci`.
3. Crea una rama enfocada en un cambio.
4. Antes de enviar una propuesta, ejecuta `npm run check`.

## Criterios de aceptación

- No introduzcas cuentas, analítica, servicios externos ni backend sin una decisión arquitectónica explícita.
- Conserva funcionamiento offline del núcleo de Consulta.
- No uses animaciones autónomas para una escena ligada al scroll: el resultado debe derivarse del progreso y revertirse al subir.
- Valida al menos 393×873 y un escritorio normal; no basta con comprobar clases CSS.
- Mantén objetivos táctiles, foco visible, movimiento reducido, textos alternativos y regiones accesibles.
- No añadas una ficha sanitaria sin una fuente veterinaria primaria, institucional o revisada profesionalmente.
- Escribe en lenguaje educativo y orientado a la acción. No diagnostiques ni prescribas.
- Si agregas un medio, documenta procedencia, derechos y optimización.

## Contenido

Las fichas viven en `app/guide-content.ts`. Reutiliza beats de `app/content.ts` cuando el tema exista en la película; deja `explore` vacío cuando sea exclusivo de Consulta. Añade alias reales, no duplicados que la normalización ya cubre.

Incluye pruebas manuales de búsqueda para el nuevo término y verifica que una palabra corta no genere coincidencias por subcadena.

## Pull requests

Describe:

- problema resuelto;
- experiencia afectada;
- evidencia visual móvil/escritorio;
- validaciones ejecutadas;
- fuente y licencia de cualquier nuevo contenido o medio.
