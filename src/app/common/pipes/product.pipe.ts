import { Pipe, PipeTransform } from '@angular/core';
import { SelectItem } from 'primeng/api';

@Pipe({ name: 'productPipe' })
export class ProductPipe implements PipeTransform {

    public transform(product: any[]): SelectItem[] {
        if (!product) return undefined;
        let transformedResult = [];
        transformedResult.push({ label: "Choose", value: null });
        return transformedResult.concat(product.map(product => ({ label: product.code ? product.name + "(" + product.code + ")" : product.name, value: product.id })));
    }

}
