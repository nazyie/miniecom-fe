import { Component, OnInit } from '@angular/core';
import { EntitlementService } from '../../service/entitlement-service';
import { TransactionHistoryModel } from '../../model/configuration-model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-transaction-history',
  imports: [CommonModule],
  templateUrl: './transaction-history.html',
  styleUrl: './transaction-history.css'
})
export class TransactionHistory implements OnInit {
  isOpen = false;
  records: TransactionHistoryModel[] = [];

  constructor(
    private entitlementService: EntitlementService
  ) { }

  ngOnInit(): void {
    this.loadData();
  }

  loadData() {
    this.entitlementService.getTransactionHistory().subscribe({
      next: (res) => {
        this.records = res.data;
      }
    })
  }

  get isCreditValue(): (value: string) => boolean {
    return (value: string) => {
      const num = parseFloat(value);
      return !isNaN(num) && num > 0;
    };
  }

  toggle() {
    this.isOpen = !this.isOpen;
  }
}
