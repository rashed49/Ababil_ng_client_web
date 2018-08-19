import { Pipe, PipeTransform } from '@angular/core';
import { SelectItem } from 'primeng/api';
import { DemandDepositProduct } from '../../services/demand-deposit-product/domain/demand-deposit-product.model';

@Pipe({ name: 'demandDepositProductPipe' })
export class DemandDepositProductPipe implements PipeTransform {

    public transform(demandDepositProducts: DemandDepositProduct[]): SelectItem[] {
        if (!demandDepositProducts) return undefined;
        let transformedResult = [];
        transformedResult.push({ label: "Select a product", value: null });
        return transformedResult.concat(demandDepositProducts.map(product => ({ label: product.name, value: product.id })));
    }

}
