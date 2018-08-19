import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { ReactiveFormsModule } from "@angular/forms";
import { ServiceProviderRoutes } from "./service.provider.routes";
import { AbabilNgSharedModule } from "../../../../common/ababil-ng-shared-module.module";
import { ServiceProviderComponent } from "./service.provider.component";
import { ServiceProviderFormComponent } from "./form/service.provider.form.component";
import { BankService } from "../../../../services/bank/service-api/bank.service";
import { ServiceProviderService } from "../../../../services/teller/service-api/service.provider.service";
import { ServiceProviderDetailComponent } from "./detail/service.provider.details.component";

@NgModule({
    imports: [
        AbabilNgSharedModule,
        RouterModule.forChild(ServiceProviderRoutes),
        ReactiveFormsModule
    ],
    declarations: [
        ServiceProviderComponent,
        ServiceProviderFormComponent,  
        ServiceProviderDetailComponent
    ],
    providers: [
        BankService,
        ServiceProviderService
    ]
})
export class ServiceProviderModule {
}