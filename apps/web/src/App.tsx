import { PortalApp } from '@consilium/portal';

/**
 * App (@consilium/web) — Shell fino de Vite.
 * El portal judicial completo vive en @consilium/portal; aquí solo se monta
 * para que el deploy web luzca igual que desktop y mobile.
 */
export const App: React.FC = () => <PortalApp />;

export default App;