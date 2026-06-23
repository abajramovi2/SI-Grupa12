import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiAccessResult, ManagedUser, UserRole, UserService } from '../../../services/user.service';
import { AuthGuardService } from '../../../middleware/middleware.authguard';

@Component({
  selector: 'app-role-access',
  imports: [CommonModule],
  templateUrl: './role-access.html',
  styleUrl: './role-access.css',
})
export class RoleAccessComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly userService = inject(UserService);
  private readonly authService = inject(AuthGuardService);

  public title = '';
  public isLoading = true;
  public result?: ApiAccessResult;
  public isAdminPanel = false;
  public isUsersLoading = false;
  public usersError = '';
  public usersMessage = '';
  public korisnici: ManagedUser[] = [];
  public uloge: UserRole[] = [];
  public selectedRoles: Record<string, string> = {};
  public savingUsers: Record<string, boolean> = {};

  public async ngOnInit(): Promise<void> {
    this.title = this.route.snapshot.data['title'] || 'Provjera pristupa';
    const apiPath = this.route.snapshot.data['apiPath'];

    if (typeof apiPath !== 'string') {
      this.result = {
        ok: false,
        status: 0,
        message: 'Frontend ruta nije pravilno konfigurisana.',
      };
      this.isLoading = false;
      return;
    }

    const allowedRoles = this.route.snapshot.data['allowedRoles'];
    if (Array.isArray(allowedRoles)) {
      this.result = this.getLocalAccessResult(apiPath, allowedRoles);
      this.isLoading = false;
      this.isAdminPanel = apiPath === '/admin' && this.result.ok;

      if (this.isAdminPanel) {
        await this.loadUsersWithRoles();
      }

      return;
    }

    try {
      this.result =
        apiPath === '/profile'
          ? await this.userService.getProfile()
          : await this.userService.getRoleMessage(apiPath);
    } catch (error) {
      this.result = {
        ok: false,
        status: 0,
        message: error instanceof Error ? error.message : 'Zahtjev prema backendu nije uspio.',
      };
    } finally {
      this.isLoading = false;
    }
  }

  private getLocalAccessResult(apiPath: string, allowedRoles: string[]): ApiAccessResult {
    if (!this.authService.isAuthenticated()) {
      return {
        ok: false,
        status: 401,
        message: 'Korisnik nije autentifikovan.',
      };
    }

    if (!this.authService.hasAnyRole(allowedRoles)) {
      return {
        ok: false,
        status: 403,
        message: 'Nemate dozvolu za ovaj resurs.',
      };
    }

    return {
      ok: true,
      status: 200,
      message: this.getSuccessMessage(apiPath),
    };
  }

  private getSuccessMessage(apiPath: string): string {
    const messages: Record<string, string> = {
      '/admin': 'Admin pristup odobren.',
      '/finansijski_direktor': 'Finansijski direktor pristup odobren.',
      '/glavni_racunovodja': 'Glavni racunovodja pristup odobren.',
      '/administrativni_radnik': 'Administrativni radnik pristup odobren.',
    };

    return messages[apiPath] || 'Pristup odobren.';
  }

  public onRoleSelection(userId: string, event: Event): void {
    const target = event.target as HTMLSelectElement | null;
    if (!target) {
      return;
    }

    this.selectedRoles[userId] = target.value;
  }

  public hasRoleChanged(korisnik: ManagedUser): boolean {
    return this.selectedRoles[korisnik.id] !== korisnik.ulogaId;
  }

  public async saveUserRole(korisnik: ManagedUser): Promise<void> {
    const nextRoleId = this.selectedRoles[korisnik.id];

    if (!nextRoleId || nextRoleId === korisnik.ulogaId) {
      return;
    }

    this.savingUsers = { ...this.savingUsers, [korisnik.id]: true };
    this.usersError = '';
    this.usersMessage = '';

    try {
      const updatedUser = await this.userService.updateUserRole(korisnik.id, nextRoleId);
      this.korisnici = this.korisnici.map((item) => (item.id === updatedUser.id ? updatedUser : item));
      this.selectedRoles = { ...this.selectedRoles, [updatedUser.id]: updatedUser.ulogaId };
      this.usersMessage = `Uloga korisnika ${updatedUser.ime} ${updatedUser.prezime} je ažurirana.`;
    } catch (error) {
      this.usersError = error instanceof Error ? error.message : 'Greška pri izmjeni uloge korisnika.';
    } finally {
      this.savingUsers = { ...this.savingUsers, [korisnik.id]: false };
    }
  }

  private async loadUsersWithRoles(): Promise<void> {
    this.isUsersLoading = true;
    this.usersError = '';
    this.usersMessage = '';

    try {
      const data = await this.userService.getUsersWithRoles();
      this.korisnici = data.korisnici;
      this.uloge = data.uloge;
      this.selectedRoles = data.korisnici.reduce<Record<string, string>>((acc, korisnik) => {
        acc[korisnik.id] = korisnik.ulogaId;
        return acc;
      }, {});
    } catch (error) {
      this.usersError = error instanceof Error ? error.message : 'Greška pri dohvatu korisnika.';
    } finally {
      this.isUsersLoading = false;
    }
  }
}
