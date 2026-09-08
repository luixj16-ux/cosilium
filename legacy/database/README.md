# Base de datos TSJ

La base local usa SQLite y se inicializa con:

```powershell
node database\init-db.js
```

## Modelo

- `roles` y `users`: identidad y permisos.
- `courts`: tribunales y jurisdicciones.
- `cases`: expediente principal y estado procesal.
- `case_activities`: actuaciones ordenadas por expediente.
- `case_documents`: metadatos de documentos; los archivos no se guardan dentro de SQLite.
- `audit_events`: trazabilidad de cambios y consultas administrativas.

Las relaciones usan claves foráneas y los índices principales cubren tribunal, estado, fecha y búsquedas de expediente.

## Siguiente paso

Crear endpoints de solo lectura para tribunales, expedientes y actuaciones; después migrar los datos de demostración desde `app.js` y retirar progresivamente la persistencia en `localStorage`.
