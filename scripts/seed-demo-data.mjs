import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { neon } from "@neondatabase/serverless";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, "..");

const files = [
  path.join(rootDir, "db", "migrations", "001_create_demo_schema.sql"),
  path.join(rootDir, "db", "seeds", "001_seed_dan_koe_demo.sql"),
];

function splitStatements(sqlText) {
  return sqlText
    .split(/;\s*(?:\n|$)/)
    .map((statement) => statement.trim())
    .filter(Boolean);
}

async function readStatements() {
  const batches = await Promise.all(files.map((file) => readFile(file, "utf8")));
  return batches.flatMap(splitStatements);
}

async function verify(sql) {
  const tables = [
    "analysis_results",
    "analysis_runs",
    "content_clusters",
    "creator_insights",
    "creators",
    "seed_profiles",
    "transcripts",
    "videos",
  ];

  const counts = [];
  for (const table of tables) {
    const rows = await sql.query(`SELECT count(*)::int AS row_count FROM public.${table}`);
    counts.push({ table, rows: rows[0].row_count });
  }

  console.table(counts);
}

async function main() {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is required. It is never printed by this script.");
  }

  const sql = neon(process.env.DATABASE_URL);
  const statements = await readStatements();

  await sql.transaction(statements.map((statement) => sql.unsafe(statement)));
  await verify(sql);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
