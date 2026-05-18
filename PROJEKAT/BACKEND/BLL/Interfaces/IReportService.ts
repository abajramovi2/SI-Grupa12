export type ReportFilters = {
  datumOd?: string | null;
  datumDo?: string | null;
};

export type ReportExportFormat = "xlsx" | "csv" | "pdf";
export type ReportType = "sazeti" | "detaljni";

export type ReportExportFile = {
  buffer: Buffer;
  contentType: string;
  filename: string;
};

export interface IReportService {
  getExpenseReport(query: any): Promise<any>;
  exportExpenseReport(query: any, requestedFormat: unknown): Promise<ReportExportFile>;
}
