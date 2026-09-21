import { PortalApp } from '@consilium/portal';

/**
 * App (@consilium/mobile) — Shell fino de Capacitor.
 * El portal judicial completo vive en @consilium/portal; aquí solo se monta
 * dentro del WebView móvil para que el deploy mobile luzca igual que web.
 */
export const App: React.FC = () => <PortalApp />;

export default App;