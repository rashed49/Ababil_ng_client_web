import { Pipe,PipeTransform } from '@angular/core';
import { SelectItem } from 'primeng/api';
import { ProductChequePrefix } from '../../services/demand-deposit-product/domain/product-cheque-prefix.model';

@Pipe({ name: 'chequePrefixPipe' })
export class ChequePrefixPipe implements PipeTransform {

 public transform(productChequePrefixes: ProductChequePrefix[]): SelectItem[] {
   if (!productChequePrefixes) return undefined;
   let transformedResult=[];
    transformedResult.push({label:"Select Cheque Prefix",value:null});
return transformedResult.concat(productChequePrefixes.map(productChequePrefix => ({ label: productChequePrefix.prefix, value:productChequePrefix.prefix  })));
}

}