import postgres from 'postgres';
const sql = postgres(process.env.DATABASE_URL!);
async function reset() {
  try {
    await sql`DROP SCHEMA public CASCADE;`;
    await sql`CREATE SCHEMA public;`;
    await sql`GRANT ALL ON SCHEMA public TO postgres;`;
    await sql`GRANT ALL ON SCHEMA public TO public;`;
    console.log('Schema public reset.');
  } catch (err) {
    console.error(err);
  } finally {
    await sql.end();
  }
}
reset();
