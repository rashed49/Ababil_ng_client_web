import { Routes } from "@angular/router";
import { DemandDepositChargeComponent } from "./demand.deposit.charge.component";
import { DemandDepositChargeConfigurationFormComponent } from "./configuration-form/demand.deposit.charge.configuration.form.component";


export const DemandDepositChargeRoutes: Routes = [
    { path: '', component: DemandDepositChargeComponent },
    { path: 'create', component: DemandDepositChargeConfigurationFormComponent },
    { path: ':id/edit', component: DemandDepositChargeConfigurationFormComponent }
]