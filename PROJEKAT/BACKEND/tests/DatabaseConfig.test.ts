import { resolveDatabaseSsl } from "../BLL/Config/DatabaseConfig";

describe("resolveDatabaseSsl", () => {
  test("iskljucuje SSL na Railway privatnoj mrezi", () => {
    expect(
      resolveDatabaseSsl(
        "postgresql://postgres:secret@postgres.railway.internal:5432/railway",
        "production"
      )
    ).toBe(false);
  });

  test("dozvoljava Railway javni proxy certifikat", () => {
    expect(
      resolveDatabaseSsl(
        "postgresql://postgres:secret@some.proxy.rlwy.net:12345/railway",
        "production"
      )
    ).toEqual({ rejectUnauthorized: false });
  });

  test("lokalno ne koristi SSL", () => {
    expect(
      resolveDatabaseSsl("postgresql://postgres:secret@localhost:5433/grupa12app", "development")
    ).toBe(false);
  });
});
