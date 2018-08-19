import { FixedDepositProduct } from './../../services/fixed-deposit-product/domain/fixed.deposit.product.model';
import { Pipe, PipeTransform } from '@angular/core';
import { SelectItem } from 'primeng/api';

@Pipe({ name: 'fixedDepositProductPipe' })
export class FixedDepositProductPipe implements PipeTransform {

    public transform(fixedDepositProduct: FixedDepositProduct[]): SelectItem[] {
        if (!fixedDepositProduct) return undefined;
        let transformedResult = [];
        transformedResult.push({ label: "Select a product", value: null });
        return transformedResult.concat(fixedDepositProduct.map(product => ({ label: product.name, value: product.id })));
    }
}
