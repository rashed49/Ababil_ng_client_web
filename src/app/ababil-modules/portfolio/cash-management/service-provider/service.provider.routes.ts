import { Routes } from "@angular/router";
import { ServiceProviderComponent } from "./service.provider.component";
import { ServiceProviderFormComponent } from "./form/service.provider.form.component";
import { ServiceProviderDetailComponent } from "./detail/service.provider.details.component";

export const ServiceProviderRoutes: Routes = [
    {path: '', component: ServiceProviderComponent},
    {path: 'create', component: ServiceProviderFormComponent},
    {path: 'detail/:billCollectionId', component: ServiceProviderDetailComponent},
    {path: 'edit/:billCollectionId', component: ServiceProviderFormComponent},
];