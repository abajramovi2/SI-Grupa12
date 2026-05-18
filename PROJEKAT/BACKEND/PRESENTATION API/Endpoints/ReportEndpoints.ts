import type { IAuthService } from "../../BLL/Interfaces/IAuthService";

const { ReportService } = require("../../BLL/Services/ReportService");

function registerReportEndpoints(app: any, authService: IAuthService, _logger?: any) {
  const reportService = new ReportService();
  const reportRoles = ["admin", "glavni_racunovodja", "finansijski_direktor"];

  app.get(
    "/api/izvjestaji/troskovi",
    authService.requireAuthentication,
    authService.requireRole(...reportRoles),
    async (req: any, res: any) => {
      try {
        const report = await reportService.getExpenseReport(req.query);
        return res.status(200).json(report);
      } catch (error: any) {
        console.error("Greska pri generisanju izvjestaja:", error);
        return res.status(400).json({
          message: error.message || "Greska pri generisanju izvjestaja.",
        });
      }
    }
  );

  app.get(
    "/api/izvjestaji/troskovi/export",
    authService.requireAuthentication,
    authService.requireRole(...reportRoles),
    async (req: any, res: any) => {
      try {
        const exportFile = await reportService.exportExpenseReport(req.query, req.query?.format);

        res.setHeader("Content-Type", exportFile.contentType);
        res.setHeader("Content-Disposition", `attachment; filename="${exportFile.filename}"`);

        return res.status(200).send(exportFile.buffer);
      } catch (error: any) {
        console.error("Greska pri exportu izvjestaja:", error);
        return res.status(400).json({
          message: error.message || "Greska pri exportu izvjestaja.",
        });
      }
    }
  );
}

module.exports = { registerReportEndpoints };
