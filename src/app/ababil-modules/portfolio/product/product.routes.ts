import { Routes } from '@angular/router';
import { ProductComponent } from './product.component';
import { ProductDetailComponent } from './details/product.details.component';
import { ProfitRateComponent } from './profit-rate/profit-rate.component';
import { ProfitRateDetailComponent } from './profit-rate/detail/profit-rate.details.component';
import { ProfitRateFormComponent } from './profit-rate/form/profit-rate.form.component';
import { ProductGeneralLedgerMappingComponent } from './product-general-ledger-mapping/product-general-ledger-mapping.component';

export const ProductRoutes: Routes = [
    { path: '', component: ProductComponent },
    { path: 'detail/:id', component: ProductDetailComponent },
    { path: ':id/profit-rate', component: ProfitRateComponent },
    { path: ':id/profit-rate/form', component: ProfitRateFormComponent },
    { path: ':id/profit-rate/detail/:profitRateId', component: ProfitRateDetailComponent },
    { path: ':id/product-general-ledger-mapping', component: ProductGeneralLedgerMappingComponent },
];



