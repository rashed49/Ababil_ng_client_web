import { Routes } from "@angular/router";
import { TimeDepositChargeComponent } from "./time.deposit.charge.component";
import { TimeDepositChargeConfigurationFormComponent } from "./configuration-form/time.deposit.charge.configuration.form.component";


export const TimeDepositChargeRoutes: Routes = [
    { path: '', component: TimeDepositChargeComponent },
    { path: 'create', component: TimeDepositChargeConfigurationFormComponent },
    { path: ':id/edit', component: TimeDepositChargeConfigurationFormComponent }
]