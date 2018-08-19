import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { ChargeConfigurationRoutes } from "./charge.configuration.routes";
import { AbabilNgSharedModule } from "../../common/ababil-ng-shared-module.module";

import { ChargeConfigurationComponent } from "./charge.configuration.component";
import { ChargeConfigurationFormComponent } from "./form/charge.configuration.form.component";

@NgModule({
    imports: [
        AbabilNgSharedModule,
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        RouterModule.forChild(ChargeConfigurationRoutes)
    ],

    declarations: [
        ChargeConfigurationComponent,
        ChargeConfigurationFormComponent
    ],

    providers: [

    ]
})
export class ChargeConfigurationModule {

}