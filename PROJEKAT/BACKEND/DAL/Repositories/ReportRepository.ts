const { db } = require("../ApDbContext/AppDB");

type ReportFilters = {
  datumOd?: string | null;
  datumDo?: string | null;
};

type BreakdownItem = {
  label: string;
  total: number;
  count: number;
  average: number;
  percentage: number;
};

class ReportRepository {
  async getExpenseReport(filters: ReportFilters) {
    const [expenses, budgetSummary] = await Promise.all([
      this.getExpenses(filters),
      this.getBudgetSummary(filters),
    ]);

    return this.buildReport(expenses, budgetSummary, filters);
  }

  private async getExpenses(filters: ReportFilters) {
    const result = await db.query(
      `
      SELECT
        tr.id,
        tr.naziv,
        tr.iznos,
        tr.datum,
        tr.opis,
        tr.status_validacije AS "statusValidacije",
        tr.kategorija_id AS "kategorijaId",
        k.naziv AS "kategorijaNaziv",
        tr.odjel_id AS "odjelId",
        o.naziv AS "odjelNaziv",
        tr.valuta_id AS "valutaId",
        v.kod AS "valutaKod",
        v.naziv AS "valutaNaziv",
        tr.projekat_id AS "projekatId",
        p.naziv_projekta AS "projekatNaziv",
        tr.dobavljac_id AS "dobavljacId",
        d.naziv_firme AS "dobavljacNaziv",
        tr.kreirao_korisnik_id AS "kreiraoKorisnikId"
      FROM troskovi tr
      LEFT JOIN kategorije k ON k.id = tr.kategorija_id
      LEFT JOIN odjeli o ON o.id = tr.odjel_id
      LEFT JOIN valute v ON v.id = tr.valuta_id
      LEFT JOIN projekti p ON p.id = tr.projekat_id
      LEFT JOIN dobavljaci d ON d.id = tr.dobavljac_id
      WHERE ($1::date IS NULL OR tr.datum >= $1::date)
        AND ($2::date IS NULL OR tr.datum <= $2::date)
      ORDER BY tr.datum DESC, tr.naziv ASC;
      `,
      [filters.datumOd || null, filters.datumDo || null]
    );

    return result.rows.map((row: any) => ({
      ...row,
      datum: this.toDateOnly(row.datum),
      iznos: this.toNumber(row.iznos),
    }));
  }

  private async getBudgetSummary(filters: ReportFilters) {
    const result = await db.query(
      `
      SELECT
        COUNT(*)::int AS "budgetCount",
        COALESCE(SUM(planirani_iznos), 0) AS "budgetTotal"
      FROM budzeti
      WHERE ($1::date IS NULL OR datum_zavrsetka >= $1::date)
        AND ($2::date IS NULL OR datum_pocetka <= $2::date);
      `,
      [filters.datumOd || null, filters.datumDo || null]
    );

    const row = result.rows[0] || {};
    return {
      budgetCount: Number(row.budgetCount || 0),
      budgetTotal: this.toNumber(row.budgetTotal || 0),
    };
  }

  private buildReport(expenses: any[], budgetSummary: any, filters: ReportFilters) {
    const totalAmount = this.round(expenses.reduce((sum, expense) => sum + Number(expense.iznos || 0), 0));
    const totalExpenses = expenses.length;
    const averageAmount = totalExpenses > 0 ? this.round(totalAmount / totalExpenses) : 0;
    const sortedByAmount = [...expenses].sort((a, b) => Number(b.iznos || 0) - Number(a.iznos || 0));
    const categoryBreakdown = this.buildBreakdown(expenses, "kategorijaNaziv", totalAmount);
    const departmentBreakdown = this.buildBreakdown(expenses, "odjelNaziv", totalAmount);
    const currencyBreakdown = this.buildBreakdown(expenses, "valutaKod", totalAmount);
    const statusBreakdown = this.buildBreakdown(expenses, "statusValidacije", totalAmount);
    const monthlyTrend = this.buildMonthlyTrend(expenses);
    const budgetTotal = this.round(budgetSummary.budgetTotal || 0);

    return {
      generatedAt: new Date().toISOString(),
      period: {
        datumOd: filters.datumOd || null,
        datumDo: filters.datumDo || null,
      },
      summary: {
        totalExpenses,
        totalAmount,
        averageAmount,
        budgetCount: budgetSummary.budgetCount || 0,
        budgetTotal,
        budgetUtilizationPercent: budgetTotal > 0 ? this.round((totalAmount / budgetTotal) * 100) : null,
        highestExpense: sortedByAmount[0] || null,
        lowestExpense: sortedByAmount.length > 0 ? sortedByAmount[sortedByAmount.length - 1] : null,
        topCategory: categoryBreakdown[0] || null,
        topDepartment: departmentBreakdown[0] || null,
      },
      breakdowns: {
        byCategory: categoryBreakdown,
        byDepartment: departmentBreakdown,
        byCurrency: currencyBreakdown,
        byStatus: statusBreakdown,
        byMonth: monthlyTrend,
      },
      expenses,
    };
  }

  private buildBreakdown(expenses: any[], fieldName: string, totalAmount: number): BreakdownItem[] {
    const totals = new Map<string, { total: number; count: number }>();

    expenses.forEach((expense) => {
      const label = this.toDisplayLabel(expense[fieldName]);
      const existing = totals.get(label) || { total: 0, count: 0 };
      existing.total += Number(expense.iznos || 0);
      existing.count += 1;
      totals.set(label, existing);
    });

    return Array.from(totals.entries())
      .map(([label, value]) => ({
        label,
        total: this.round(value.total),
        count: value.count,
        average: value.count > 0 ? this.round(value.total / value.count) : 0,
        percentage: totalAmount > 0 ? this.round((value.total / totalAmount) * 100) : 0,
      }))
      .sort((a, b) => b.total - a.total || a.label.localeCompare(b.label));
  }

  private buildMonthlyTrend(expenses: any[]): BreakdownItem[] {
    const totals = new Map<string, { label: string; sortKey: string; total: number; count: number }>();
    const totalAmount = expenses.reduce((sum, expense) => sum + Number(expense.iznos || 0), 0);

    expenses.forEach((expense) => {
      const monthInfo = this.getMonthTrendInfo(expense.datum);
      const existing = totals.get(monthInfo.key) || {
        label: monthInfo.label,
        sortKey: monthInfo.sortKey,
        total: 0,
        count: 0,
      };
      existing.total += Number(expense.iznos || 0);
      existing.count += 1;
      totals.set(monthInfo.key, existing);
    });

    return Array.from(totals.values())
      .map((value) => ({
        label: value.label,
        total: this.round(value.total),
        count: value.count,
        average: value.count > 0 ? this.round(value.total / value.count) : 0,
        percentage: totalAmount > 0 ? this.round((value.total / totalAmount) * 100) : 0,
        sortKey: value.sortKey,
      }))
      .sort((a, b) => a.sortKey.localeCompare(b.sortKey))
      .map(({ sortKey: _sortKey, ...item }) => item);
  }

  private getMonthTrendInfo(value: unknown): { key: string; label: string; sortKey: string } {
    const dateParts = this.getDateParts(value);
    if (!dateParts) {
      return { key: "bez-datuma", label: "Bez datuma", sortKey: "999999-99" };
    }

    const month = Number(dateParts.month);
    const monthNames = [
      "Januar",
      "Februar",
      "Mart",
      "April",
      "Maj",
      "Juni",
      "Juli",
      "August",
      "Septembar",
      "Oktobar",
      "Novembar",
      "Decembar",
    ];

    if (month < 1 || month > 12) {
      return { key: "bez-datuma", label: "Bez datuma", sortKey: "999999-99" };
    }

    const normalizedYear = dateParts.year.padStart(6, "0");
    const normalizedMonth = dateParts.month.padStart(2, "0");

    return {
      key: `${dateParts.year}-${normalizedMonth}`,
      label: `${monthNames[month - 1]} ${dateParts.year}`,
      sortKey: `${normalizedYear}-${normalizedMonth}`,
    };
  }

  private toDisplayLabel(value: unknown): string {
    if (value === null || value === undefined || value === "") {
      return "Nerasporedjeno";
    }

    return String(value);
  }

  private toDateOnly(value: unknown): string | null {
    const dateParts = this.getDateParts(value);
    if (!dateParts) {
      return null;
    }

    return `${dateParts.year}-${dateParts.month}-${dateParts.day}`;
  }

  private getDateParts(value: unknown): { year: string; month: string; day: string } | null {
    if (!value) {
      return null;
    }

    let rawValue: string;

    if (value instanceof Date) {
      rawValue = value.toISOString();
    } else {
      rawValue = String(value);
    }

    const match = rawValue.match(/^([+-]?\d{4,6})-(\d{2})-(\d{2})/);
    if (!match) {
      return null;
    }

    const year = match[1].replace(/^\+/, "").replace(/^0+(?=\d{5,}$)/, "");

    return {
      year,
      month: match[2],
      day: match[3],
    };
  }

  private toNumber(value: unknown): number {
    const numberValue = Number(value);
    return Number.isFinite(numberValue) ? numberValue : 0;
  }

  private round(value: number): number {
    return Number(value.toFixed(2));
  }
}

module.exports = { ReportRepository };
