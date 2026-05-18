export {};

const express = require("express");
const request = require("supertest");

const mockReportService = {
  getExpenseReport: jest.fn(),
  exportExpenseReport: jest.fn(),
};

jest.mock("../BLL/Services/ReportService", () => ({
  ReportService: jest.fn().mockImplementation(() => mockReportService),
}));

const { registerReportEndpoints } = require("../PRESENTATION API/Endpoints/ReportEndpoints");

describe("ReportEndpoints", () => {
  let app: any;

  const authService = {
    verifyBearerToken: jest.fn((_req: any, _res: any, next: any) => next()),
    requireAuthentication: jest.fn((req: any, _res: any, next: any) => {
      req.user = { sub: "test-user", roles: ["finansijski_direktor"] };
      next();
    }),
    requireRole: jest.fn(() => (_req: any, _res: any, next: any) => next()),
    refreshSession: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    app = express();
    app.use(express.json());
    registerReportEndpoints(app, authService);
  });

  test("GET /api/izvjestaji/troskovi treba vratiti generisani izvjestaj", async () => {
    const report = {
      summary: { totalExpenses: 1, totalAmount: 120 },
      expenses: [{ id: "t1", naziv: "Gorivo", iznos: 120 }],
    };
    mockReportService.getExpenseReport.mockResolvedValue(report);

    const response = await request(app)
      .get("/api/izvjestaji/troskovi")
      .query({ datumOd: "2026-01-01", datumDo: "2026-01-31" });

    expect(response.status).toBe(200);
    expect(response.body).toEqual(report);
    expect(mockReportService.getExpenseReport).toHaveBeenCalledWith({
      datumOd: "2026-01-01",
      datumDo: "2026-01-31",
    });
  });

  test("GET /api/izvjestaji/troskovi/export treba vratiti fajl za download", async () => {
    mockReportService.exportExpenseReport.mockResolvedValue({
      buffer: Buffer.from("test"),
      contentType: "text/csv; charset=utf-8",
      filename: "izvjestaj.csv",
    });

    const response = await request(app)
      .get("/api/izvjestaji/troskovi/export")
      .query({ format: "csv" });

    expect(response.status).toBe(200);
    expect(response.headers["content-type"]).toContain("text/csv");
    expect(response.headers["content-disposition"]).toContain("izvjestaj.csv");
    expect(mockReportService.exportExpenseReport).toHaveBeenCalledWith({ format: "csv" }, "csv");
  });

  test("treba pozivati RBAC middleware s rolama za izvjestaje", async () => {
    mockReportService.getExpenseReport.mockResolvedValue({ summary: {}, expenses: [] });

    await request(app).get("/api/izvjestaji/troskovi");

    expect(authService.requireAuthentication).toHaveBeenCalled();
    expect(authService.requireRole).toHaveBeenCalledWith(
      "admin",
      "glavni_racunovodja",
      "finansijski_direktor"
    );
  });
});
