export {};

const express = require("express");
const request = require("supertest");

const mockDb = {
  query: jest.fn(),
};

jest.mock("../DAL/ApDbContext/AppDB", () => ({
  db: mockDb,
}));

const { registerUserEndpoints } = require("../PRESENTATION API/Endpoints/UserEndpoints");

describe("UserEndpoints", () => {
  const authService = {
    requireAuthentication: jest.fn((req: any, _res: any, next: any) => {
      req.user = { sub: "admin-1", roles: ["admin"] };
      next();
    }),
    requireRole: jest.fn(() => (_req: any, _res: any, next: any) => next()),
  };

  const createApp = () => {
    const app = express();
    app.use(express.json());
    registerUserEndpoints(app, authService);
    return app;
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("GET /api/korisnici vraca korisnike i dostupne uloge", async () => {
    mockDb.query
      .mockResolvedValueOnce({
        rows: [
          {
            id: "user-1",
            ime: "Admin",
            prezime: "Adminovic",
            email: "admin@tim12.com",
            statusNaloga: "AKTIVAN",
            ulogaId: "role-1",
            ulogaNaziv: "ADMINISTRATOR",
          },
        ],
      })
      .mockResolvedValueOnce({
        rows: [{ id: "role-1", naziv: "ADMINISTRATOR", opis: "Administrator sistema" }],
      });

    const response = await request(createApp()).get("/api/korisnici");

    expect(response.status).toBe(200);
    expect(response.body.korisnici).toHaveLength(1);
    expect(response.body.uloge).toHaveLength(1);
    expect(authService.requireRole).toHaveBeenCalledWith("admin");
  });

  test("PATCH /api/korisnici/:id/uloga azurira ulogu korisnika", async () => {
    mockDb.query
      .mockResolvedValueOnce({ rowCount: 1, rows: [{ id: "user-1" }] })
      .mockResolvedValueOnce({
        rows: [
          {
            id: "user-1",
            ime: "Test",
            prezime: "Korisnik",
            email: "test@tim12.com",
            statusNaloga: "AKTIVAN",
            ulogaId: "role-2",
            ulogaNaziv: "FINANSIJSKI_DIREKTOR",
          },
        ],
      });

    const response = await request(createApp())
      .patch("/api/korisnici/user-1/uloga")
      .send({ ulogaId: "role-2" });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Uloga korisnika je ažurirana.");
    expect(response.body.korisnik.ulogaId).toBe("role-2");
    expect(mockDb.query).toHaveBeenNthCalledWith(
      1,
      expect.stringContaining("UPDATE korisnici"),
      ["role-2", "user-1"]
    );
  });

  test("PATCH /api/korisnici/:id/uloga odbija prazan zahtjev", async () => {
    const response = await request(createApp()).patch("/api/korisnici/user-1/uloga").send({});

    expect(response.status).toBe(400);
    expect(response.body.error).toBe("Nova uloga nije poslana.");
    expect(mockDb.query).not.toHaveBeenCalled();
  });
});
