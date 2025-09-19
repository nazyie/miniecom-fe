import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
// import {
//   trigger,
//   transition,
//   style,
//   animate,
// } from '@angular/animations';


export type PickerMode = 'DATE' | 'RANGE';

interface DateLabel {
  date: Date;
  label: string;
}

@Component({
  selector: 'app-date-picker',
  imports: [CommonModule],
  templateUrl: './date-picker.html',
  styleUrl: './date-picker.css',
  // animations: [
  //   trigger('calendarAnim', [
  //     transition(':enter', [
  //       style({ opacity: 0, transform: 'translateY(10px)' }),
  //       animate(
  //         '250ms ease-out',
  //         style({ opacity: 1, transform: 'translateY(0)' })
  //       ),
  //     ]),
  //     transition(':leave', [
  //       animate(
  //         '200ms ease-in',
  //         style({ opacity: 0, transform: 'translateY(-10px)' })
  //       ),
  //     ]),
  //   ]),
  // ],
})
export class DatePicker implements OnInit {
  @Input() format: 'DATE' | 'RANGE' = 'DATE';
  @Input() disabledDates: Date[] = [];
  @Input() labels: { [key: string]: string } = {};
  @Output() selectedDates = new EventEmitter<Date[]>();

  today: Date = new Date();
  currentMonth: number = this.today.getMonth();
  currentYear: number = this.today.getFullYear();

  selected: Date[] = [];
  weeks: { date: Date; inCurrentMonth: boolean }[][] = [];

  ngOnInit() {
    this.generateCalendar(this.currentYear, this.currentMonth);
  }

  generateCalendar(year: number, month: number) {
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    const startDay = firstDay.getDay();
    const daysInMonth = lastDay.getDate();

    const prevMonthLastDate = new Date(year, month, 0).getDate();
    const days: { date: Date; inCurrentMonth: boolean }[] = [];

    // Previous month filler
    for (let i = startDay - 1; i >= 0; i--) {
      days.push({
        date: new Date(year, month - 1, prevMonthLastDate - i),
        inCurrentMonth: false,
      });
    }

    // Current month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push({ date: new Date(year, month, i), inCurrentMonth: true });
    }

    // Next month filler
    const nextDays = 42 - days.length;
    for (let i = 1; i <= nextDays; i++) {
      days.push({ date: new Date(year, month + 1, i), inCurrentMonth: false });
    }

    // Break into weeks
    this.weeks = [];
    for (let i = 0; i < days.length; i += 7) {
      this.weeks.push(days.slice(i, i + 7));
    }
  }

  isDisabled(date: Date): boolean {
    return this.disabledDates.some(
      (d) =>
        d.getFullYear() === date.getFullYear() &&
        d.getMonth() === date.getMonth() &&
        d.getDate() === date.getDate()
    );
  }

  isSelected(date: Date): boolean {
    return this.selected.some(
      (d) =>
        d.getFullYear() === date.getFullYear() &&
        d.getMonth() === date.getMonth() &&
        d.getDate() === date.getDate()
    );
  }

  selectDate(date: Date, inCurrentMonth: boolean) {
    if (this.isDisabled(date)) return;

    // Auto navigate if clicked on prev/next month day
    if (!inCurrentMonth) {
      this.currentMonth = date.getMonth();
      this.currentYear = date.getFullYear();
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

    this.selectedDates.emit(this.selected);
  }

  isInRange(date: Date): boolean {
    if (this.format !== 'RANGE' || this.selected.length < 2) return false;
    return (
      date >= this.selected[0] &&
      date <= this.selected[1] &&
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