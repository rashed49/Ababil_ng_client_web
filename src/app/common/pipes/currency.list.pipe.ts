import { Pipe, PipeTransform } from '@angular/core';
import { SelectItem } from 'primeng/api';
import { Currency } from '../../services/currency/domain/currency.models';

@Pipe({ name: 'currencyPipe' })
export class CurrencyPipe implements PipeTransform {

  public transform(currencies: Currency[]): SelectItem[] {
    if (!currencies) return undefined;
    let transformedResult = [];
    transformedResult.push({ label: "Choose", value: null });
    return transformedResult.concat(currencies.map(currency => ({ label: currency.name, value: currency.code })));
  }
}