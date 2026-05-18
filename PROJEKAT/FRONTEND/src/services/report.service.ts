import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  ExpenseReport,
  ReportExportFormat,
  ReportFilters,
} from '../models/entities';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ReportService {
  private readonly apiUrl = `${environment.apiUrl}/izvjestaji/troskovi`;
  private readonly accessTokenKey = 'kc_access_token';

  constructor(private http: HttpClient) {}

  private getAuthOptions(params?: HttpParams) {
    const accessToken = sessionStorage.getItem(this.accessTokenKey);
    const headers = accessToken ? new HttpHeaders({ Authorization: `Bearer ${accessToken}` }) : undefined;

    return {
      withCredentials: true,
      ...(headers ? { headers } : {}),
      ...(params ? { params } : {}),
    };
  }

  getExpenseReport(filters: ReportFilters): Observable<ExpenseReport> {
    return this.http.get<ExpenseReport>(this.apiUrl, this.getAuthOptions(this.buildParams(filters)));
  }

  exportExpenseReport(format: ReportExportFormat, filters: ReportFilters): Observable<Blob> {
    const params = this.buildParams(filters).set('format', format);

    return this.http.get(`${this.apiUrl}/export`, {
      ...this.getAuthOptions(params),
      responseType: 'blob',
    });
  }

  private buildParams(filters: ReportFilters): HttpParams {
    let params = new HttpParams();

    if (filters.datumOd) {
      params = params.set('datumOd', filters.datumOd);
    }

    if (filters.datumDo) {
      params = params.set('datumDo', filters.datumDo);
    }

    if (filters.tipIzvjestaja) {
      params = params.set('tipIzvjestaja', filters.tipIzvjestaja);
    }

    return params;
  }
}
