import { Routes } from "@angular/router";
import { TimeDepositLienComponent } from "../time-deposit-lien/time.deposit.lien.component";
import { TimeDepositLienImposeComponent } from "../time-deposit-lien/lien-impose/time.deposit.lien.impose.component";
import { DetailTimeDepositLienComponent } from "../time-deposit-lien/detail/detail.time.deposit.lien.component";
import { EditTimeDepositLienComponent } from "../../ababil-modules/time-deposit-lien/edit/edit.time.deposit.lien.component";


export const LienRoutes: Routes = [
    { path: '', component: TimeDepositLienComponent },
    { path: 'lien-impose', component: TimeDepositLienImposeComponent },
    { path: 'detail/:id', component: DetailTimeDepositLienComponent },
    { path: 'detail/:id/edit', component: EditTimeDepositLienComponent }
];