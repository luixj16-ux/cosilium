# ADR-0001 · Capacitor en vez de React Native

Estado: **Aceptado**. Fecha: 2026 (reestructuración).

## Contexto
CONSILIUM necesita una app móvil (oficinas en tránsito) sin duplicar la lógica.
El core es DDD compartido; la UI es React.

## Decisión
Usar **Capacitor 6** sobre un shell Vite-compatible: la misma base TSX que
`apps/web` se empaqueta para iOS/Android mediante la webview del sistema.

## Alternativas
- **React Native**: ecosistema potente, pero exige un core separado
  (RN no comparte React DOM) y complejiza el DDD/append-only compartido.
- **PWA-only**: cubre navegador pero pierde acceso nativo sólido a filesystem
  y fidelidad de la webview (Safari/WebView Android varían).
- **Flutter**: idioma nuevo, rompe el monolingüismo TS del monorepo.

## Consecuencias
- Misma fuente React para web/desktop/mobile → solo una UI a mantener.
- El procesamiento pesado se sirve por **WASM** (`rust/wasm-engine`), portable a
  la webview.
- Tiempo de build y empaquetado de Capacitor aceptables para el uso interno de
  despachos.
- Se evita mantener bridges nativos por plataforma en JS.