export {};

const { AIAnalysisService } = require("../BLL/Services/AIAnalysisService");

describe("AIAnalysisService fallback logic", () => {
  let svc: any;

  beforeEach(() => {
    svc = new AIAnalysisService("http://noop");
  });

  test("vraća VALIDAN kada nema signala", () => {
    const result = (svc as any).fallbackExpenseAnalysis({ iznos: 100 }, {});
    expect(result.status).toBe("VALIDAN");
    expect(result.findings).toHaveLength(0);
    expect(result.riskScore).toBeCloseTo(0.12, 2);
  });

  test("detektuje amount outlier kada je iznos znatno veci od prosjeka", () => {
    const expense = { iznos: 250 };
    const context = { historicalExpenses: [{ iznos: 50 }, { iznos: 40 }, { iznos: 30 }] };
    const result = (svc as any).fallbackExpenseAnalysis(expense, context);
    expect(result.status).toBe("ANOMALIJA");
    expect(result.findings.some((f: any) => f.type === "AMOUNT_OUTLIER")).toBe(true);
    expect(result.severity).toBe("HIGH");
  });

  test("detektuje duplikat i prekoracen budzet", () => {
    const expense = { iznos: 600, naziv: "Trosak" };
    const context = {
      duplicateCandidates: [{}, {}],
      budget: { planiraniIznos: 500, potrosenoPrijeTroska: 0 },
    };

    const result = (svc as any).fallbackExpenseAnalysis(expense, context);
    expect(result.findings.some((f: any) => f.type === "POSSIBLE_DUPLICATE")).toBe(true);
    expect(result.findings.some((f: any) => f.type === "BUDGET_EXCEEDED")).toBe(true);
    expect(result.severity).toBe("HIGH");
  });
});

describe("AIAnalysisService category suggestion", () => {
  let svc: any;
  let fetchSpy: jest.SpyInstance;

  beforeEach(() => {
    svc = new AIAnalysisService("http://ai-service.test/");
    fetchSpy = jest.spyOn(global, "fetch" as any);
  });

  afterEach(() => {
    fetchSpy.mockRestore();
  });

  test("salje zahtjev AI servisu i vraca prijedlog kategorije", async () => {
    const suggestion = {
      categoryId: "kat-1",
      categoryName: "Oprema",
      confidence: 0.84,
      reason: "Laptop pripada opremi.",
    };

    fetchSpy.mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue(suggestion),
    } as any);

    const payload = {
      naziv: "Laptop Lenovo",
      categories: [{ id: "kat-1", naziv: "Oprema" }],
    };

    const result = await svc.suggestExpenseCategory(payload);

    expect(result).toEqual(suggestion);
    expect(fetchSpy).toHaveBeenCalledWith(
      "http://ai-service.test/ai/category-suggestion",
      expect.objectContaining({
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
    );
  });

  test("vraca kontrolisanu poruku kada AI servis vrati neuspjesan status", async () => {
    fetchSpy.mockResolvedValue({
      ok: false,
      status: 503,
      json: jest.fn(),
    } as any);

    const result = await svc.suggestExpenseCategory({ naziv: "Laptop" });

    expect(result).toEqual({
      categoryId: null,
      categoryName: null,
      confidence: 0,
      reason: "AI servis trenutno nije dostupan za prijedlog kategorije.",
    });
  });

  test("vraca kontrolisanu poruku kada poziv AI servisa pukne", async () => {
    fetchSpy.mockRejectedValue(new Error("network down"));

    const result = await svc.suggestExpenseCategory({ naziv: "Laptop" });

    expect(result.categoryId).toBeNull();
    expect(result.confidence).toBe(0);
    expect(result.reason).toBe("AI servis trenutno nije dostupan za prijedlog kategorije.");
  });
});
