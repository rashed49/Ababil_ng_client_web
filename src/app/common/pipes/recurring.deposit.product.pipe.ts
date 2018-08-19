import { RecurringDepositProduct } from './../../services/recurring-deposit-product/domain/recurring.deposit.product.model';
import { Pipe, PipeTransform } from '@angular/core';
import { SelectItem } from 'primeng/api';

@Pipe({ name: 'recurringDepositProductPipe' })
export class RecurringDepositProductPipe implements PipeTransform {

    public transform(recurringDepositProducts: RecurringDepositProduct[]): SelectItem[] {
        if (!recurringDepositProducts) return undefined;
        let transformedResult = [];
        transformedResult.push({ label: "Select a product", value: null });
        return transformedResult.concat(recurringDepositProducts.map(product => ({ label: product.name, value: product.id })));
    }

}
