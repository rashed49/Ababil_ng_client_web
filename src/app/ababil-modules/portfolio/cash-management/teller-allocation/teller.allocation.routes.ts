import { Routes } from "@angular/router";
import { TellerAllocationComponent } from "./teller.allocation.component";
import { TellerAllocationCreateFormComponent } from "./form/create/teller.allocation.create.form.component";
import { TellerAllocationDetailComponent } from "./detail/teller.allocation.detail.component";
import { TellerAllocationEditFormComponent } from "./form/edit/teller.allocation.edit.formcomponent";

export const TellerAllocationRoutes: Routes = [
    { path: '', component: TellerAllocationComponent },
    { path: 'create', component: TellerAllocationCreateFormComponent },
    { path: 'detail/:id', component: TellerAllocationDetailComponent, pathMatch: 'full' },
    { path: 'detail/:id/edit', component: TellerAllocationEditFormComponent, pathMatch: 'full' },


];