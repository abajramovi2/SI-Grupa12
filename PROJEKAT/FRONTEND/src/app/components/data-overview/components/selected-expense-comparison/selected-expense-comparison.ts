import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DataOverviewExpense } from '../../../../../models/entities';

type ComparisonChartType = 'bar' | 'pie';

@Component({
  selector: 'app-selected-expense-comparison',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './selected-expense-comparison.html',
  styleUrl: './selected-expense-comparison.css',
})
export class SelectedExpenseComparisonComponent {
  @Input() public expenses: DataOverviewExpense[] = [];
  @Output() public closePanel = new EventEmitter<void>();
  public chartType: ComparisonChartType = 'bar';
  private readonly chartColors = ['#1769ff', '#12b76a', '#f97316', '#7c3aed', '#06b6d4', '#ef4444'];
  public readonly chartTypes: Array<{ value: ComparisonChartType; label: string }> = [
    { value: 'bar', label: 'Stubičasti' },
    { value: 'pie', label: 'Kružni' },
  ];

  private readonly exchangeRatesToBam: Record<string, number> = {
    BAM: 1,
    KM: 1,
    EUR: 1.95583,
    USD: 1.8,
    GBP: 2.3,
  };

  public get totalAmount(): number {
    return this.expenses.reduce((sum, expense) => sum + this.getExpenseAmountInBam(expense), 0);
  }

  public get highestAmount(): number | null {
    if (!this.expenses.length) {
      return null;
    }

    return Math.max(...this.expenses.map((expense) => this.getExpenseAmountInBam(expense)));
  }

  public get lowestAmount(): number | null {
    if (!this.expenses.length) {
      return null;
    }

    return Math.min(...this.expenses.map((expense) => this.getExpenseAmountInBam(expense)));
  }

  public get averageAmount(): number | null {
    if (!this.expenses.length) {
      return null;
    }

    return this.totalAmount / this.expenses.length;
  }

  public get amountDifference(): number | null {
    if (this.highestAmount === null || this.lowestAmount === null) {
      return null;
    }

    return this.highestAmount - this.lowestAmount;
  }

  public get chartRows(): Array<{ label: string; value: number; percentage: number; color: string }> {
    const maxAmount = this.highestAmount || 0;

    return this.expenses.map((expense, index) => {
      const value = this.getExpenseAmountInBam(expense);

      return {
        label: expense.naziv || 'Trošak',
        value,
        percentage: maxAmount > 0 ? (value / maxAmount) * 100 : 0,
        color: this.chartColors[index % this.chartColors.length],
      };
    });
  }

  public get pieGradient(): string {
    let current = 0;
    const total = this.totalAmount;

    if (!total) {
      return '#edf1f7';
    }

    return this.chartRows
      .map((row) => {
        const next = current + (row.value / total) * 100;
        const segment = `${row.color} ${current}% ${next}%`;
        current = next;
        return segment;
      })
      .join(', ');
  }

  public getExpenseCurrency(expense: DataOverviewExpense): string {
    return expense.valutaKod || expense.valutaNaziv || '-';
  }

  public getExpenseAmountInBam(expense: DataOverviewExpense): number {
    const currencyCode = (expense.valutaKod || expense.valutaNaziv || 'BAM').toUpperCase();
    const rate = this.exchangeRatesToBam[currencyCode] ?? 1;

    return Number(expense.iznos || 0) * rate;
  }

  public isHighestExpense(expense: DataOverviewExpense): boolean {
    return this.highestAmount !== null && this.getExpenseAmountInBam(expense) === this.highestAmount;
  }

  public isLowestExpense(expense: DataOverviewExpense): boolean {
    return this.lowestAmount !== null && this.getExpenseAmountInBam(expense) === this.lowestAmount;
  }
}
