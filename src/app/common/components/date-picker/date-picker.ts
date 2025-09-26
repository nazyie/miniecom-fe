import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { ToastService } from '../../services/toast-service';

@Component({
  selector: 'app-date-picker',
  imports: [CommonModule],
  templateUrl: './date-picker.html',
  styleUrl: './date-picker.css',
})
export class DatePicker implements OnInit, OnChanges {
  @Input() format: 'DATE' | 'RANGE' = 'RANGE';
  @Input() disabledDates: string[] = [];
  @Input() labels: Record<string, string> = {};

  // @Input() disabledDates: string[] = [
  //   '2025-09-20',
  //   '2025-09-25',
  //   '2025-10-02'
  // ];
  // @Input() labels: Record<string, string> = {
  //   '2025-09-10': '1 Available',
  // };

  @Output() selectedDates = new EventEmitter<string[]>();

  constructor(
    private toastService: ToastService
  ) { }

  today: Date = new Date();
  currentMonth: number = this.today.getMonth();
  currentYear: number = this.today.getFullYear();
  disabledSet = new Set<string>();

  selected: string[] = [];
  weeks: { date: string; inCurrentMonth: boolean }[][] = [];

  rangeStart: string | null = null;
  rangeEnd: string | null = null;

  ngOnInit() {
    this.generateCalendar(this.currentYear, this.currentMonth);
    this.disabledSet = new Set(this.disabledDates);
  }

  ngOnChanges() {
    this.disabledSet = new Set(this.disabledDates);
    console.log(this.disabledSet);
  }

  /** Format Date -> YYYY-MM-DD */
  private formatDate(d: Date): string {
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  }

  getLabel(date: string): string | null {
    return this.labels[date] ?? null;
  }

  generateCalendar(year: number, month: number) {
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    const startDay = firstDay.getDay();
    const daysInMonth = lastDay.getDate();

    const prevMonthLastDate = new Date(year, month, 0).getDate();
    const days: { date: string; inCurrentMonth: boolean }[] = [];

    // Previous month filler
    for (let i = startDay - 1; i >= 0; i--) {
      days.push({
        date: this.formatDate(new Date(year, month - 1, prevMonthLastDate - i)),
        inCurrentMonth: false,
      });
    }

    // Current month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push({ date: this.formatDate(new Date(year, month, i)), inCurrentMonth: true });
    }

    // Next month filler (to make 6 weeks grid = 42 days)
    const nextDays = 42 - days.length;
    for (let i = 1; i <= nextDays; i++) {
      days.push({
        date: this.formatDate(new Date(year, month + 1, i)),
        inCurrentMonth: false,
      });
    }

    // Break into weeks
    this.weeks = [];
    for (let i = 0; i < days.length; i += 7) {
      this.weeks.push(days.slice(i, i + 7));
    }
  }

  isDisabled(date: string): boolean {
    return this.disabledDates.includes(date);
  }

  isSelected(date: string): boolean {
    return this.selected.includes(date);
  }

  selectDate(date: string, inCurrentMonth: boolean) {
    if (this.isDisabled(date)) return;

    const d = new Date(date);

    // Auto navigate if clicked on prev/next month day
    if (!inCurrentMonth) {
      this.currentMonth = d.getMonth();
      this.currentYear = d.getFullYear();
      this.generateCalendar(this.currentYear, this.currentMonth);
    }

    if (this.format === 'DATE') {
      this.selected = [date];
    } else if (this.format === 'RANGE') {
      if (this.selected.length === 0 || this.selected.length === 2) {
        this.selected = [date];
      } else if (this.selected.length === 1) {
        if (date < this.selected[0]) {
          this.selected = [date, this.selected[0]];
        } else {
          this.selected.push(date);
        }
      }
    }

    if (this.format === 'RANGE' && this.selected.length === 2) {
      const [rangeStart, rangeEnd] = [ this.selected[0], this.selected[1]];

      if (this.rangeContainsDisabled(rangeStart, rangeEnd)) {
        this.selected = [];
        this.toastService.error('Tidak dibenarkan untuk memilih tarikh yang telah di tempah');
      }
    }

    this.selectedDates.emit(this.selected);
  }

  private rangeContainsDisabled(start: any, end: any): boolean {
    // Ensure [earlier, later]
    const [s, e] = start < end ? [start, end] : [end, start];

    let current = s;
    while (current <= e) {
      if (this.disabledSet.has(current)) {
        return true;
      }
      current = this.addDays(current, 1); // safely add one day in string form
    }
    return false;
  }

  private addDays(dateStr: string, days: number): string {
    const [year, month, day] = dateStr.split('-').map(Number);
    const d = new Date(year, month - 1, day + days);
    return [
      d.getFullYear(),
      String(d.getMonth() + 1).padStart(2, '0'),
      String(d.getDate()).padStart(2, '0')
    ].join('-');
  }

  isInRange(date: string): boolean {
    if (this.format !== 'RANGE' || this.selected.length < 2) return false;
    return (
      new Date(date) >= new Date(this.selected[0]) &&
      new Date(date) <= new Date(this.selected[1]) &&
      !this.isSelected(date)
    );
  }

  prevMonth() {
    if (this.currentMonth === 0) {
      this.currentMonth = 11;
      this.currentYear--;
    } else {
      this.currentMonth--;
    }
    this.generateCalendar(this.currentYear, this.currentMonth);
  }

  nextMonth() {
    if (this.currentMonth === 11) {
      this.currentMonth = 0;
      this.currentYear++;
    } else {
      this.currentMonth++;
    }
    this.generateCalendar(this.currentYear, this.currentMonth);
  }
}