import type { Application, Response } from "express";
import type { IAuthService, AuthenticatedRequest } from "../../BLL/Interfaces/IAuthService";
const { db } = require("../../DAL/ApDbContext/AppDB");

export function registerUserEndpoints(app: Application, authService: IAuthService) {
  app.use("/api", authService.requireAuthentication);

  app.get("/api/profile", (req: AuthenticatedRequest, res: Response) => {
    res.status(200).json({ user: req.user });
  });

  app.get("/api/korisnici", authService.requireRole("admin"), async (_req: AuthenticatedRequest, res: Response) => {
    try {
      const [usersResult, rolesResult] = await Promise.all([
        db.query(`
          SELECT
            k.id,
            k.ime,
            k.prezime,
            k.email,
            k.status_naloga AS "statusNaloga",
            u.id AS "ulogaId",
            u.naziv AS "ulogaNaziv",
            u.opis AS "ulogaOpis"
          FROM korisnici k
          JOIN uloge u ON u.id = k.uloga_id
          ORDER BY k.prezime, k.ime, k.email
        `),
        db.query(`
          SELECT id, naziv, opis
          FROM uloge
          ORDER BY naziv
        `),
      ]);

      res.status(200).json({
        korisnici: usersResult.rows,
        uloge: rolesResult.rows,
      });
    } catch (error) {
      console.error("Greska pri dohvatu korisnika:", error);
      res.status(500).json({ error: "Greška pri dohvatu korisnika." });
    }
  });

  app.patch("/api/korisnici/:id/uloga", authService.requireRole("admin"), async (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.params;
    const { ulogaId } = req.body || {};

    if (!ulogaId || typeof ulogaId !== "string") {
      res.status(400).json({ error: "Nova uloga nije poslana." });
      return;
    }

    try {
      const updateResult = await db.query(
        `
          UPDATE korisnici
          SET uloga_id = $1
          WHERE id = $2
          RETURNING id
        `,
        [ulogaId, id]
      );

      if (updateResult.rowCount === 0) {
        res.status(404).json({ error: "Korisnik nije pronađen." });
        return;
      }

      const userResult = await db.query(
        `
          SELECT
            k.id,
            k.ime,
            k.prezime,
            k.email,
            k.status_naloga AS "statusNaloga",
            u.id AS "ulogaId",
            u.naziv AS "ulogaNaziv",
            u.opis AS "ulogaOpis"
          FROM korisnici k
          JOIN uloge u ON u.id = k.uloga_id
          WHERE k.id = $1
        `,
        [id]
      );

      res.status(200).json({
        message: "Uloga korisnika je ažurirana.",
        korisnik: userResult.rows[0],
      });
    } catch (error: any) {
      if (error?.code === "23503") {
        res.status(400).json({ error: "Odabrana uloga ne postoji." });
        return;
      }

      console.error("Greska pri izmjeni uloge korisnika:", error);
      res.status(500).json({ error: "Greška pri izmjeni uloge korisnika." });
    }
  });

  app.get("/api/admin", authService.requireRole("admin"), (_req: AuthenticatedRequest, res: Response) => {
    res.status(200).json({ message: "Admin pristup odobren." });
  });

  app.get("/api/finansijski_direktor", authService.requireRole("admin", "finansijski_direktor"), (_req: AuthenticatedRequest, res: Response) => {
    res.status(200).json({ message: "Finansijski direktor pristup odobren." });
  });

  app.get("/api/glavni_racunovodja", authService.requireRole("admin", "glavni_racunovodja"), (_req: AuthenticatedRequest, res: Response) => {
    res.status(200).json({ message: "Glavni računovodja pristup odobren." });
  });

  app.get("/api/administrativni_radnik", authService.requireRole("admin", "administrativni_radnik"), (_req: AuthenticatedRequest, res: Response) => {
    res.status(200).json({ message: "Administrativni radnik pristup odobren." });
  });
  
}
