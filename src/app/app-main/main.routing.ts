import { environment } from './../../environments/environment';
import { DocumentComponent } from './../common/components/document/document.component';
import { Routes } from '@angular/router';
import { MainComponent } from './main.component';
import { DashboardDemoComponent } from '../demo/view/dashboarddemo';
import { DraftsComponent } from '../ababil-modules/draft/draft.component';


let developmentBranchRoutes = [
  {
    path: '', component: MainComponent, children: [
      { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: DashboardDemoComponent, data: { title: 'Dashboard' } },
      { path: 'drafts', component: DraftsComponent, data: { title: 'Dashboard' } },
      { path: 'glaccount', loadChildren: '../ababil-modules/gl-account/gl-account.module#GlAccountModule', data: { title: 'GL Account' } },
      { path: 'approval-flow', loadChildren: '../ababil-modules/approvalflow/approval.flow.module#ApprovalFlowModule', data: { title: 'Workflow' } },
      { path: 'banks', loadChildren: '../ababil-modules/bank/bank.module#BankModule', data: { title: 'Banks' } },
      { path: 'customer', loadChildren: '../ababil-modules/cis/cis.module#CISModule', data: { title: "Active Customers" } },
      { path: 'nominee', loadChildren: '../ababil-modules/portfolio/nominee/nominee.module#NomineeModule' },
      { path: 'special-profit-rate', loadChildren: '../ababil-modules/portfolio/special-profit-rate/special.profit.rate.module#AccountSpecialProfitRateModule' },
      { path: 'pension-scheduler', loadChildren: '../ababil-modules/portfolio/pension-scheduler/pension.scheduler.module#PensionSchedulerModule' },

      { path: 'menus', loadChildren: '../ababil-modules/groupmenu/groupmenu.module#GroupmenuModule', data: { title: "Menu Groups" } },
      { path: 'identity', loadChildren: '../ababil-modules/identity/identity.module#IdentityModule', data: { title: "Identity" } },
      { path: 'kyc', loadChildren: '../ababil-modules/portfolio/kyc/kyc.module#KycModule', data: { title: "KYC" } },
      { path: 'account', loadChildren: '../ababil-modules/portfolio/account/account.module#AccountModule', data: { title: "Account" } },
      { path: 'demand-deposit-account', loadChildren: '../ababil-modules/portfolio/demand-deposit/account/demand.deposit.account.module#DemandDepositAccountModule', data: { title: "Demand Deposit Account" } },
      { path: 'demand-deposit-product', loadChildren: '../ababil-modules/portfolio/demand-deposit/product/demand-deposit-product.module#DemandDepositProductModule', data: { title: "Demand Deposit Product" } },
      { path: 'demand-deposit-charge', loadChildren: '../ababil-modules/portfolio/demand-deposit/charge/demand.deposit.charge.module#DemandDepositChargeModule', data: { title: "Demand Deposit Charge" } },
      { path: 'fixed-deposit-account', loadChildren: '../ababil-modules/portfolio/time-deposit/fixed-deposit/account/fixed.deposit.account.module#FixedDepositAccountModule', data: { title: "Fixed Deposit Account" } },
      { path: 'fixed-deposit-product', loadChildren: '../ababil-modules/portfolio/time-deposit/fixed-deposit/product/fixed.deposit.product.module#FixedDepositProductModule', data: { title: "Fixed Deposit Product" } },
      { path: 'recurring-deposit-account', loadChildren: '../ababil-modules/portfolio/time-deposit/recurring-deposit/account/recurring.deposit.account.module#RecurringDepositAccountModule', data: { title: "Recurring Deposit Account" } },
      { path: 'recurring-deposit-product', loadChildren: '../ababil-modules/portfolio/time-deposit/recurring-deposit/product/recurring.deposit.product.module#RecurringDepositProductModule', data: { title: "Recurring Deposit Product" } },
      { path: 'time-deposit-charge', loadChildren: '../ababil-modules/portfolio/time-deposit/charge/time.deposit.charge.module#TimeDepositChargeModule', data: { title: "Time Deposit Charge" } },
      { path: 'teller-setup', loadChildren: '../ababil-modules/portfolio/cash-management/teller/teller.module#TellerModule', data: { title: "Teller Setup" } },
      { path: 'teller-allocation', loadChildren: '../ababil-modules/portfolio/cash-management/teller-allocation/teller.allocation.module#TellerAllocationModule', data: { title: "Teller Allocation" } },
      { path: 'teller-transaction', loadChildren: '../ababil-modules/teller-transaction/teller.module#TellerModule', data: { title: "Teller Transaction" } },
      { path: 'service-provider', loadChildren: '../ababil-modules/portfolio/cash-management/service-provider/service.provider.module#ServiceProviderModule', data: { title: "Service provider" } },
      { path: 'product', loadChildren: '../ababil-modules/portfolio/product/product.module#ProductModule', data: { title: "Product" } },
      // { path: 'product', loadChildren: '../ababil-modules/portfolio/demand-deposit/product/product.module#ProductModule', data: { title: "Demand Deposit Product" } },
      // { path: 'cheques', loadChildren: '../ababil-modules/portfolio/demand-deposit/account/cheque/cheque.module#ChequeModule', data: { title: "Cheque" }},

      { path: 'account-operator', loadChildren: '../ababil-modules/portfolio/signature/account.operator.module#AccountOperatorModule', data: { title: "Account Operator" } },
      { path: 'location', loadChildren: '../ababil-modules/location/location.module#LocationModule', data: { title: "Location" } },
      { path: 'transaction-profile', loadChildren: '../ababil-modules/portfolio/demand-deposit/account/transaction-profile/transaction.profile.module#TransactionProfileModule', data: { title: "Transaction Profile" } },
      { path: 'views', loadChildren: '../ababil-modules/views/views.module#ViewsModule', data: { title: "Views" } },

      { path: 'lien', loadChildren: '../ababil-modules/time-deposit-lien/time.deposit.lien.module#TimeDepositLienModule', data: { title: "lien" } },
      { path: 'document', loadChildren: '../ababil-modules/document/document.module#DocumentModule', data: { title: "Document" }} ,
      { path: 'charge', loadChildren: '../ababil-modules/charge-configuration/charge.configuration.module#ChargeConfigurationModule', data: { title: "charge" }}, 
      { path: 'report', loadChildren: '../ababil-modules/report/reports.module#ReportsModule', data: { title: "Reports" }},
      { path: 'remittance', loadChildren: '../ababil-modules/portfolio/inland-remittance/inland.remittance.module#InlandRemittanceModule', data: { title: "remittance" }} ,
      {path: 'income-tax-configuration-view', loadChildren: '../ababil-modules/portfolio/income-tax-configuration-view/income.tax.configuration.view.module#IncomeTaxConfigurationViewModule', data: {title:"Income Tax Configuration View"}},
      { path: 'time-deposit-charge', loadChildren: '../ababil-modules/portfolio/time-deposit/charge/time.deposit.charge.module#TimeDepositChargeModule', data: { title: "Time Deposit Charge" } },

    ]
  }
];

let deploymentBranchRoutes = [
  {
    path: '', component: MainComponent, children: [
      { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: DashboardDemoComponent, data: { title: 'Dashboard' } },
      { path: 'glaccount', loadChildren: '../ababil-modules/gl-account/gl-account.module#GlAccountModule', data: { title: 'GL Account' } },
      { path: 'approval-flow', loadChildren: '../ababil-modules/approvalflow/approval.flow.module#ApprovalFlowModule', data: { title: 'Workflow' } },
      { path: 'views', loadChildren: '../ababil-modules/views/views.module#ViewsModule', data: { title: "Views" } },
      { path: 'report', loadChildren: '../ababil-modules/report/reports.module#ReportsModule', data: { title: "Reports" } }
    ]
  }
];


export const MainRoutes: Routes = environment.auth === 'LEGACY-ABABIL' ? deploymentBranchRoutes : developmentBranchRoutes;