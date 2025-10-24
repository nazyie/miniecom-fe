import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'ruleType' })
export class RuleTypePipe implements PipeTransform {
    transform(value: string | null | undefined): string {
    if (!value) return '';

    return value === 'equal_or_more' ? 'Bilangan slot lebih daripada' 
    : 'Bilangan slot sama dengan';
  }

}