import { Routes } from "@angular/router";
import { ChargeConfigurationComponent } from "./charge.configuration.component";
import { ChargeConfigurationFormComponent } from "./form/charge.configuration.form.component";

export const ChargeConfigurationRoutes: Routes = [
    { path: 'charge-configuration-list', component: ChargeConfigurationComponent },
    { path: 'charge-configuration-list/charge-configuration-form', component: ChargeConfigurationFormComponent }
]