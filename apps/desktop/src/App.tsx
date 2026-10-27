import { PortalApp } from '@consilium/portal';

/**
 * App (@consilium/desktop) — Shell fino de Tauri.
 * El portal judicial completo vive en @consilium/portal; aquí solo se monta
 * dentro del WebView nativo para que el deploy desktop luzca igual que web.
 */
export const App: React.FC = () => <PortalApp />;

export default App;