export function resolveDatabaseSsl(
  databaseUrl: string | undefined,
  nodeEnv = process.env.NODE_ENV
): false | { rejectUnauthorized: false } {
  if (!databaseUrl) {
    throw new Error("DATABASE_URL nije definisan.");
  }

  if (nodeEnv !== "production") {
    return false;
  }

  const hostname = new URL(databaseUrl).hostname.toLowerCase();
  if (hostname.endsWith(".railway.internal")) {
    return false;
  }

  return { rejectUnauthorized: false };
}
