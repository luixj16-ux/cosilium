/**
 * Portal bootstrap — arranca el API REST del portal judicial TSJ
 * basado en los use cases del Core (dependencias en memoria).
 */
import { buildPortalRestContext, createPortalServer } from './portal.rest.js';

const port = Number(process.env.PORT ?? 8787);
const context = buildPortalRestContext();
const server = createPortalServer(context);

server.listen(port, () => {
  console.log(`CONSILIUM portal REST escuchando en http://localhost:${port}`);
});