
import { GlAccountLookupComponent } from './components/gl-account-lookup/gl.account.lookup.component';
import { SubLedgerLookupComponent } from './components/sub-ledger-lookup/sub.ledger.lookup.component';
import { ContactInformationComponent } from './components/contact-information/contact.information.component';
import { FixedDepositProductPipe } from './pipes/fixed.deposit.product.pipe';
import { SentenceCasePipe } from './pipes/sentence.case.pipe';
import { FormBaseComponent } from './components/base.form.component';
import { ApprovalflowService } from './../services/approvalflow/service-api/approval.flow.service';
import { OrganizationTypePipe } from './pipes/organization.type.list.pipe';
import { TypeOfBusinessPipe } from './pipes/type.of.business.list.pipe';
import { CustomerClassificationTypePipe } from './pipes/customer.classification.type.list';
import { SourceOfFundListPipe } from './pipes/source.of.fund.list.pipe';
import { KeyFilter } from './directives/keyfilter';
import { OccupationPipe } from './pipes/occupatio.list.pipe';
import { ImageUploadComponent } from './components/image-upload/image.upload.component';
import { WebCamComponent } from './components/webcam/webcam.component';
import { TranslateModule } from '@ngx-translate/core';
import { AddressComponent } from './components/address/address.component';
import { IndividualLookupComponent } from './components/individual-lookup/individual.lookup.component';

import { OrganizationLookupComponent } from './components/organization-lookup/organization.lookup.component';
import { CountryPipe, DivisionPipe, DistrictPipe, UpazillaPipe, NationalityPipe, FatcaCountryPipe, PostCodePipe } from './pipes/location.pipe';

// import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap/modal/modal.module';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AccordionModule } from 'primeng/accordion';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
//import { ColorPickerModule } from 'primeng/components';
//import { ChartModule } from 'primeng/components/chart/chart';
import { CheckboxModule } from 'primeng/checkbox';
import { ChipsModule } from 'primeng/chips';
//import { CodeHighlighterModule } from 'primeng/components';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { SharedModule } from 'primeng/shared';
import { ContextMenuModule } from 'primeng/contextmenu';
import { DataGridModule } from 'primeng/datagrid';
import { DataListModule } from 'primeng/datalist';
import { DataScrollerModule } from 'primeng/datascroller';
import { DataTableModule } from 'primeng/datatable';
import { DialogModule } from 'primeng/dialog';
//import { DragDropModule } from 'primeng/components';
import { DropdownModule } from 'primeng/dropdown';
import { EditorModule } from 'primeng/editor';
//import { FieldsetModule } from 'primeng/components/fieldset/fieldset';
import { FileUploadModule } from 'primeng/fileupload';
import { GrowlModule } from 'primeng/growl';
import { InputMaskModule } from 'primeng/inputmask';
import { InputSwitchModule } from 'primeng/inputswitch';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
//import { LightboxModule } from 'primeng/components/lightbox/lightbox';
import { ListboxModule } from 'primeng/listbox';
//import { MegaMenuModule } from 'primeng/components';
import { MenuModule } from 'primeng/menu';
import { MenubarModule } from 'primeng/menubar';
import { MessagesModule } from 'primeng/messages';
import { MultiSelectModule } from 'primeng/multiselect';
import { OrderListModule } from 'primeng/orderlist';
import { OrganizationChartModule } from 'primeng/organizationchart';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { PaginatorModule } from 'primeng/paginator';
import { PanelModule } from 'primeng/panel';
import { PanelMenuModule } from 'primeng/panelmenu';
import { PasswordModule } from 'primeng/password';
import { PickListModule } from 'primeng/picklist';
import { ProgressBarModule } from 'primeng/progressbar';
import { RadioButtonModule } from 'primeng/radiobutton';
import { SelectButtonModule } from 'primeng/selectbutton';
import { SliderModule } from 'primeng/slider';
//import { SpinnerModule } from 'primeng/components/spinner/spinner';
import { SplitButtonModule } from 'primeng/splitbutton';
import { StepsModule } from 'primeng/steps';
import { TabMenuModule } from 'primeng/tabmenu';
import { TabViewModule } from 'primeng/tabview';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { ToolbarModule } from 'primeng/toolbar';
import { TooltipModule } from 'primeng/tooltip';
import { TreeModule } from 'primeng/tree';
import { TreeTableModule } from 'primeng/treetable';
import { NotificationService } from './notification/notification.service';
import { VerifierSelectionListPipe } from './pipes/verifier.selection.list.pipe';
import { VerifierSelectionComponent } from './components/verifier-selection/verifier.selection.component';
import { CommentComponent } from './components/comment/comment.component';
import { SidebarModule } from 'primeng/sidebar';
import { ApplicantTypeListPipe } from './pipes/applicant.type.list.pipe';
import { CustomerTypePipe } from './pipes/customer.type.pipe';
import { ChequePrefixPipe } from './pipes/cheque.prefix.pipe';
import { EnterNavigationDirective } from './directives/enter.navigation.directive';
import { DocumentComponent } from './components/document/document.component';
import { InstructionTypePipe } from './pipes/instruction.type.pipes';
import { CurrencyPipe } from './pipes/currency.list.pipe';
import { AmountInWordsService } from './services/amount.in.words.service';
import { TellerAllocationPipe } from './pipes/teller.allocation.pipe';
import { GlAccountPipe } from './pipes/glaccount.list.pipe';
import { DemandDepositProductPipe } from './pipes/demand.deposit.product.pipe';
import { RecurringDepositProductPipe } from './pipes/recurring.deposit.product.pipe';
import { GeneralLedgerListPipe } from './pipes/general-ledger.list.pipe';
import { GeneralLedgerTypeListPipe } from './pipes/general-ledger-type.list.pipe';
import { CurrencyMaskModule } from "ng2-currency-mask";


import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';

// import { NoConflictStyleCompatibilityMode } from '@angular/material/core';
import { ImageCropperModule } from 'ngx-image-cropper';
// import { ImageCropperModule } from 'ng2-img-cropper';
import { OwnerListPipe } from './pipes/owner.list.pipe';
import { CustomerDetailsComponent } from './components/customer-details/customer-details.component';
import { TellerListPipe } from './pipes/teller.list.pipe';
import { AccountOpeningChannelPipe } from './pipes/account.opening.channel.pipe';
import { TellerPipe } from './pipes/teller.pipe';
import { BranchPipe } from './pipes/branch.pipe';
import { OccupationComponent } from './components/occupation/occupation.component';
import { FatcaEntityTypePipe } from './pipes/fatca.entity.type.pipe';
import { CommonDemandDepositAccountDetailComponent } from './components/account-details/demand-deposit-details/demand.deposit.details.component';
import { CommonBankNoticeDetailsComponent } from './components/bank-notice/bank.notice.details.component';
import { CommonSpecialInstructionComponent } from './components/special-instruction/special.instruction.component';
import { AccountSignatureDetailsComponent } from './components/account-signature-details/account.signature.details.component';
import { CommonFixedDepositAccountDetailComponent } from './components/account-details/fixed-deposit-details/fixed.deposit.details.component';
import { CommonRecurringDepositAccountDetailsComponent } from './components/account-details/recurring-deposit-details/recurring.deposit.details.component';
import { DenominatorComponent } from './components/denominator/denominator.component';
import { AccountNumberDirective } from './directives/account.number.directive';
import { AccountNumberComponent } from './components/account-number/account.number.component';
import { AbabilCurrencyDirective } from './components/currency/currency.directive';
import { AbabilCurrencyPipe } from './components/currency/currency.pipe';
import { ChargeTableComponent } from './components/charge-component/charge.component';
import { ProductPipe } from './pipes/product.pipe';
import { OwnBranchLookUpComponent } from './components/own-branch-lookup/own.branch.lookup.component';

@NgModule({
  imports: [
    TranslateModule,
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    AccordionModule,
    //AutoCompleteModule,
    ButtonModule,
    CalendarModule,
    //ColorPickerModule,
    //ChartModule,
    CheckboxModule,
    ChipsModule,
    //CodeHighlighterModule,
    ConfirmDialogModule,
    SharedModule,
    ContextMenuModule,
    DataGridModule,
    DataListModule,
    DataScrollerModule,
    DataTableModule,
    DialogModule,
    //DragDropModule,
    DropdownModule,
    EditorModule,
    //FieldsetModule,
    FileUploadModule,
    GrowlModule,
    InputMaskModule,
    InputSwitchModule,
    InputTextModule,
    InputTextareaModule,
    //LightboxModule,
    ListboxModule,
    //MegaMenuModule,
    MenuModule,
    MenubarModule,
    MessagesModule,
    MultiSelectModule,
    OrderListModule,
    OrganizationChartModule,
    OverlayPanelModule,
    PaginatorModule,
    PanelModule,
    PanelMenuModule,
    PasswordModule,
    PickListModule,
    ProgressBarModule,
    RadioButtonModule,
    //ScheduleModule,
    SelectButtonModule,
    SliderModule,
    //SpinnerModule,
    SplitButtonModule,
    StepsModule,
    TabMenuModule,
    TabViewModule,
    //TieredMenuModule,
    ToggleButtonModule,
    ToolbarModule,
    TooltipModule,
    TreeModule,
    TreeTableModule,
    SidebarModule,
    CurrencyMaskModule,
    NgbModalModule,

    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatToolbarModule,
    MatTooltipModule,
    // DocumentModule,
    // NoConflictStyleCompatibilityMode,
    ImageCropperModule,
    MatTabsModule
  ],
  declarations: [
    AccountOpeningChannelPipe,
    FixedDepositProductPipe,
    VerifierSelectionListPipe,
    ApplicantTypeListPipe,
    CustomerTypePipe,
    VerifierSelectionComponent,
    CommentComponent,
    ChequePrefixPipe,
    EnterNavigationDirective,
    DocumentComponent,
    InstructionTypePipe,
    CurrencyPipe,
    BranchPipe,
    TellerAllocationPipe,
    OwnerListPipe,
    GlAccountPipe,
    DemandDepositProductPipe,
    RecurringDepositProductPipe,
    ProductPipe,
    GeneralLedgerListPipe,
    GeneralLedgerTypeListPipe,
    CountryPipe,
    DistrictPipe,
    UpazillaPipe,
    PostCodePipe,
    DivisionPipe,
    NationalityPipe,
    TellerListPipe,
    TellerPipe,
    AddressComponent,
    ContactInformationComponent,
    IndividualLookupComponent,
    OrganizationLookupComponent,
    WebCamComponent,
    ImageUploadComponent,
    KeyFilter,
    OccupationPipe,
    SourceOfFundListPipe,
    CustomerClassificationTypePipe,
    CustomerDetailsComponent,
    TypeOfBusinessPipe,
    OrganizationTypePipe,
    SentenceCasePipe,
    GlAccountLookupComponent,
    SubLedgerLookupComponent,
    OccupationComponent,
    FatcaEntityTypePipe,
    FatcaCountryPipe,
    CommonDemandDepositAccountDetailComponent,
    CommonBankNoticeDetailsComponent,
    CommonSpecialInstructionComponent,
    AccountSignatureDetailsComponent,
    ChargeTableComponent,
    CommonFixedDepositAccountDetailComponent,
    CommonRecurringDepositAccountDetailsComponent,
    DenominatorComponent,
    AccountNumberComponent,
    AbabilCurrencyDirective,
    AbabilCurrencyPipe,
    AccountNumberDirective,
    OwnBranchLookUpComponent
    
  ],
  exports: [
    ReactiveFormsModule,
    FormsModule,
    TranslateModule,
    CommonModule,
    AccordionModule,
    AutoCompleteModule,

    // DocumentModule,
    ButtonModule,
    CalendarModule,

    //ColorPickerModule,
    //ChartModule,
    CheckboxModule,
    ChipsModule,
    //CodeHighlighterModule,
    ConfirmDialogModule,
    SharedModule,
    ContextMenuModule,
    DataGridModule,
    DataListModule,
    DataScrollerModule,
    DataTableModule,
    DialogModule,
    //DragDropModule,
    DropdownModule,
    EditorModule,
    //FieldsetModule,
    FileUploadModule,
    GrowlModule,
    InputMaskModule,
    InputSwitchModule,
    InputTextModule,
    InputTextareaModule,
    //LightboxModule,
    ListboxModule,
    //MegaMenuModule,
    MenuModule,
    MenubarModule,
    MessagesModule,
    MultiSelectModule,
    OrderListModule,
    OrganizationChartModule,
    OverlayPanelModule,
    PaginatorModule,
    PanelModule,
    PanelMenuModule,
    PasswordModule,
    PickListModule,
    ProgressBarModule,
    RadioButtonModule,
    //ScheduleModule,
    SelectButtonModule,

    SliderModule,
    //SpinnerModule,
    SplitButtonModule,
    StepsModule,
    TabMenuModule,
    TabViewModule,
    //TieredMenuModule,
    ToggleButtonModule,
    ToolbarModule,
    TooltipModule,
    TreeModule,
    TreeTableModule,
    VerifierSelectionComponent,
    CommentComponent,
    SidebarModule,
    AccountOpeningChannelPipe,
    FixedDepositProductPipe,
    VerifierSelectionListPipe,
    ApplicantTypeListPipe,
    CustomerTypePipe,
    ChequePrefixPipe,
    SentenceCasePipe,
    EnterNavigationDirective,
    DocumentComponent,
    InstructionTypePipe,
    TellerAllocationPipe,
    OwnerListPipe,
    GlAccountPipe,
    DemandDepositProductPipe,
    RecurringDepositProductPipe,
    ProductPipe,
    GeneralLedgerListPipe,
    GeneralLedgerTypeListPipe,
    CurrencyPipe,
    BranchPipe,
    TellerListPipe,
    TellerPipe,
    CurrencyMaskModule,
    NgbModalModule,

    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatToolbarModule,
    MatTooltipModule,
    // NoConflictStyleCompatibilityMode,
    CountryPipe,
    DivisionPipe,
    DistrictPipe,
    UpazillaPipe,
    PostCodePipe,
    NationalityPipe,
    OrganizationTypePipe,
    AddressComponent,
    ContactInformationComponent,
    IndividualLookupComponent,
    OrganizationLookupComponent,
    ImageCropperModule,
    ImageUploadComponent,
    KeyFilter,
    OccupationPipe,
    SourceOfFundListPipe,
    CustomerClassificationTypePipe,
    CustomerDetailsComponent,
    TypeOfBusinessPipe,
    GlAccountLookupComponent,
    SubLedgerLookupComponent,
    OccupationComponent,
    FatcaEntityTypePipe,
    FatcaCountryPipe,
    CommonDemandDepositAccountDetailComponent,
    CommonBankNoticeDetailsComponent,
    CommonSpecialInstructionComponent,
    AccountSignatureDetailsComponent,
    CommonFixedDepositAccountDetailComponent,
    CommonRecurringDepositAccountDetailsComponent,
    DenominatorComponent,
    AccountNumberComponent,
    AbabilCurrencyDirective ,
    ChargeTableComponent,
    OwnBranchLookUpComponent   
  ],

  providers: [
    ApprovalflowService,
    AbabilCurrencyPipe
  ]

})
export class AbabilNgSharedModule { }
