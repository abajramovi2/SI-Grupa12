export {};

const { Pool } = require("pg");
const { resolveDatabaseSsl } = require("../../BLL/Config/DatabaseConfig");

let _db: any = null;

function getDb() {
  if (!_db) {
    if (!process.env.DATABASE_URL) {
      throw new Error("DATABASE_URL nije definisan.");
    }
    _db = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: resolveDatabaseSsl(process.env.DATABASE_URL),
    });
  }
  return _db;
}

module.exports = { get db() { return getDb(); } };
