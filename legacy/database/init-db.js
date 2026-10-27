const fs = require('node:fs');
const path = require('node:path');
const { DatabaseSync } = require('node:sqlite');

const databaseDirectory = __dirname;
const databasePath = path.join(databaseDirectory, 'tsj.sqlite');
const schemaPath = path.join(databaseDirectory, 'schema.sql');

fs.mkdirSync(databaseDirectory, { recursive: true });
const database = new DatabaseSync(databasePath);
database.exec(fs.readFileSync(schemaPath, 'utf8'));
database.close();

console.log(`Base de datos TSJ inicializada en ${databasePath}`);
