import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { ToastService } from '../../services/toast-service';
import { ResponseText } from '../../constant/response';

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
  @Input() selected: string[] = [];
  @Input() disabledWeekdays: string[] = ['monday'];
  @Input() disablePastDates: boolean = false;
  @Input() disableSameDate: boolean = true;

  @Output() selectedDates = new EventEmitter<string[]>();
  @Output() monthChange = new EventEmitter<{ year: number; month: number }>();

  constructor(private toastService: ToastService) { }

  today = new Date();
  currentMonth = this.today.getMonth(); // 0-based
  currentYear = this.today.getFullYear();
  disabledSet = new Set<string>();
  weeks: { date: string; inCurrentMonth: boolean }[][] = [];

  ngOnInit() {
    this.generateCalendar(this.currentYear, this.currentMonth);
    this.disabledSet = new Set(this.disabledDates.map(d => d));
  }

  ngOnChanges() {
    this.disabledSet = new Set(this.disabledDates.map(d => d));
  }

  private formatDate(d: Date): string {
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  }

  getLabel(date: string): string | null {
    return this.labels[date] ?? null;
  }

  /** ✅ emits the current visible calendar month/year */
  private emitMonthChange() {
    this.monthChange.emit({
      year: this.currentYear,
      month: this.currentMonth + 1 // convert to 1-based for readability
    });
  }

  generateCalendar(year: number, month: number) {
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDay = firstDay.getDay();
    const daysInMonth = lastDay.getDate();
    const prevMonthLastDate = new Date(year, month, 0).getDate();
    const days: { date: string; inCurrentMonth: boolean }[] = [];

    // previous month filler
    for (let i = startDay - 1; i >= 0; i--) {
      days.push({
        date: this.formatDate(new Date(year, month - 1, prevMonthLastDate - i)),
        inCurrentMonth: false,
      });
    }

    // current month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push({ date: this.formatDate(new Date(year, month, i)), inCurrentMonth: true });
    }

    // next month filler (to make 6 weeks = 42 days)
    const nextDays = 42 - days.length;
    for (let i = 1; i <= nextDays; i++) {
      days.push({
        date: this.formatDate(new Date(year, month + 1, i)),
        inCurrentMonth: false,
      });
    }

    // break into weeks
    this.weeks = [];
    for (let i = 0; i < days.length; i += 7) {
      this.weeks.push(days.slice(i, i + 7));
    }

    // 🔥 always emit current month/year after generation
    this.emitMonthChange();
  }

  isDisabled(date: string): boolean {
    if (this.disabledSet.has(date)) return true;

    const d = new Date(date);

    if (this.disabledWeekdays.length > 0) {
      const dayName = d.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
      if (this.disabledWeekdays.map(x => x.toLowerCase()).includes(dayName)) {
        return true;
      }
    }

    if (this.disablePastDates) {
      const todayStr = this.formatDate(this.today);
      if (date < todayStr) return true;
    }

    return false;
  }

  isSelected(date: string): boolean {
    return this.selected.includes(date);
  }

  selectDate(date: string, inCurrentMonth: boolean) {
    if (this.isDisabled(date)) return;

    const d = new Date(date);

    // auto navigate if clicked on prev/next month day
    if (!inCurrentMonth) {
      this.currentMonth = d.getMonth();
      this.currentYear = d.getFullYear();
      this.generateCalendar(this.currentYear, this.currentMonth);
      return; // prevent double selection on navigation
    }

    switch (this.format) {
      case 'DATE': {
        this.selected = [date];
        break;
      }

      case 'RANGE': {
        const [firstDate] = this.selected;

        // Start new range if none or already completed
        if (this.selected.length === 0 || this.selected.length === 2) {
          this.selected = [date];
          break;
        }

        // Prevent selecting the same date twice
        if (this.disableSameDate && date === firstDate) {
          this.toastService.error(ResponseText.ERR_DATE_SAME_DATE);
          return;
        }

        // Sort start/end chronologically for consistency
        const [start, end] = date < firstDate ? [date, firstDate] : [firstDate, date];
        this.selected = [start, end];

        if (this.selected.length === 2) {
          const [rangeStart, rangeEnd] = this.selected;
          let isValidRangeDate = true;

          // first checking
          if (this.rangeContainsDisabled(rangeStart, rangeEnd)) {
            isValidRangeDate = false;
          }

          // second checking
          if (this.rangeContainsDisabledWeekday(rangeStart, rangeEnd)) {
            isValidRangeDate = false;
          }

          if (!isValidRangeDate) {
            this.selected = [];
            this.toastService.error(ResponseText.ERR_DATE_BLOCK);
          }
        }

        break;
      }
    }

    this.selectedDates.emit(this.selected);
  }

  private rangeContainsDisabledWeekday(start: string, end: string): boolean {
    const startDate = new Date(start);
    const endDate = new Date(end);

    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
      const dayName = d.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();

      // Ensure disabledWeekdays array also uses lowercase strings
      if (this.disabledWeekdays.map(w => w.toLowerCase()).includes(dayName)) {
        return true;
      }
    }

    return false;
  }


  private rangeContainsDisabled(start: string, end: string): boolean {
    const [s, e] = start < end ? [start, end] : [end, start];
    let current = s;
    while (current <= e) {
      if (this.disabledSet.has(current)) return true;
      current = this.addDays(current, 1);
    }
    return false;
  }

  private addDays(dateStr: string, days: number): string {
    const [y, m, d] = dateStr.split('-').map(Number);
    const date = new Date(y, m - 1, d + days);
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
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
