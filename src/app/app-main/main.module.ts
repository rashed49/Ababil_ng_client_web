import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule} from '@angular/forms';

import { MainComponent } from '../app-main/main.component';
import {AppMenuComponent, AppSubMenu}  from '../app-menu/app.menu.component';
import {AppNotificationComponent} from '../app-notification/app.notification.component';
import {AppTopBar}  from '../app-topbar/app.topbar.component';
import {AppFooter}  from '../app-footer/app.footer.component';
import {AppRightPanel}  from '../app-right-panel/app.rightpanel.component';
import {InlineProfileComponent}  from '../app-profile/app.profile.component';
import {DashboardDemoComponent} from '../demo/view/dashboarddemo';

import {RouterModule} from '@angular/router';
import {MainRoutes} from './main.routing';
import {TranslateService} from '@ngx-translate/core';
import {TranslateModule} from '@ngx-translate/core';


import { AccordionModule } from 'primeng/components/accordion/accordion';
//import { AutoCompleteModule } from 'primeng/components/autocomplete/autocomplete';
import { ButtonModule } from 'primeng/components/button/button';
import { CalendarModule } from 'primeng/components/calendar/calendar';
//import { ColorPickerModule } from 'primeng/components';
//import { ChartModule } from 'primeng/components/chart/chart';
import { CheckboxModule } from 'primeng/components/checkbox/checkbox';
import { ChipsModule } from 'primeng/components/chips/chips';
//import { CodeHighlighterModule } from 'primeng/components';
import { ConfirmDialogModule } from 'primeng/components/confirmdialog/confirmdialog';
import { SharedModule } from 'primeng/components/common/shared';
import { ContextMenuModule } from 'primeng/components/contextmenu/contextmenu';
import { DataGridModule } from 'primeng/components/datagrid/datagrid';
import { DataListModule } from 'primeng/components/datalist/datalist';
import { DataScrollerModule } from 'primeng/components/datascroller/datascroller';
import { DataTableModule } from 'primeng/components/datatable/datatable';
import { DialogModule } from 'primeng/components/dialog/dialog';
//import { DragDropModule } from 'primeng/components';
import { DropdownModule } from 'primeng/components/dropdown/dropdown';
import { EditorModule } from 'primeng/components/editor/editor';
//import { FieldsetModule } from 'primeng/components/fieldset/fieldset';
import { FileUploadModule } from 'primeng/components/fileupload/fileupload';
import { GrowlModule } from 'primeng/components/growl/growl';
import { InputMaskModule } from 'primeng/components/inputmask/inputmask';
import { InputSwitchModule } from 'primeng/components/inputswitch/inputswitch';
import { InputTextModule } from 'primeng/components/inputtext/inputtext';
import { InputTextareaModule } from 'primeng/components/inputtextarea/inputtextarea';
//import { LightboxModule } from 'primeng/components/lightbox/lightbox';
import { ListboxModule } from 'primeng/components/listbox/listbox';
//import { MegaMenuModule } from 'primeng/components';
import { MenuModule } from 'primeng/components/menu/menu';
import { MenubarModule } from 'primeng/components/menubar/menubar';
import { MessagesModule } from 'primeng/components/messages/messages';
import { MultiSelectModule } from 'primeng/components/multiselect/multiselect';
import { OrderListModule } from 'primeng/components/orderlist/orderlist';
import { OrganizationChartModule } from 'primeng/components/organizationchart/organizationchart';
import { OverlayPanelModule } from 'primeng/components/overlaypanel/overlaypanel';
import { PaginatorModule } from 'primeng/components/paginator/paginator';
import { PanelModule } from 'primeng/components/panel/panel';
import { PanelMenuModule } from 'primeng/components/panelmenu/panelmenu';
import { PasswordModule } from 'primeng/components/password/password';
import { PickListModule } from 'primeng/components/picklist/picklist';
import { ProgressBarModule } from 'primeng/components/progressbar/progressbar';
import { RadioButtonModule } from 'primeng/components/radiobutton/radiobutton';
import { SelectButtonModule } from 'primeng/components/selectbutton/selectbutton';
import { SliderModule } from 'primeng/components/slider/slider';
//import { SpinnerModule } from 'primeng/components/spinner/spinner';
import { SplitButtonModule } from 'primeng/components/splitbutton/splitbutton';
import { StepsModule } from 'primeng/components/steps/steps';
import { TabMenuModule } from 'primeng/components/tabmenu/tabmenu';
import { TabViewModule } from 'primeng/components/tabview/tabview';
import { ToggleButtonModule } from 'primeng/components/togglebutton/togglebutton';
import { ToolbarModule } from 'primeng/components/toolbar/toolbar';
import { TooltipModule } from 'primeng/components/tooltip/tooltip';
import { TreeModule } from 'primeng/components/tree/tree';
import { TreeTableModule } from 'primeng/components/treetable/treetable';

import {CarService} from '../demo/service/carservice';
import {CountryService} from '../demo/service/countryservice';
import {EventService} from '../demo/service/eventservice';
import {NodeService} from '../demo/service/nodeservice';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {CISModule} from '../ababil-modules/cis/cis.module';
import {DraftsComponent} from '../ababil-modules/draft/draft.component';
import {AppLoadingOverlayComponent} from '../app-loading-overlay/app.loading.overlay.component';
import { ChartModule } from 'primeng/components/chart/chart';
import {MatCardModule} from '@angular/material/card';
import { ApprovalflowService } from '../services/approvalflow/service-api/approval.flow.service';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(MainRoutes),
    TranslateModule,
    AccordionModule,
    //AutoCompleteModule,

    ButtonModule,
    CalendarModule,
    //ChartModule,
    CheckboxModule,
    ChipsModule,
    ConfirmDialogModule,
    SharedModule,
    ContextMenuModule,
    DataGridModule,
    DataListModule,
    DataScrollerModule,
    DataTableModule,
    DialogModule,
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
    SelectButtonModule,
    SliderModule,
    //SpinnerModule,
    SplitButtonModule,
    StepsModule,
    TabMenuModule,
    TabViewModule,
    ToggleButtonModule,
    ToolbarModule,
    TooltipModule,
    TreeModule,
    TreeTableModule,
    NgbModule.forRoot(),
    ChartModule,
    MatCardModule
  ],
  declarations: [
    AppMenuComponent,
    AppNotificationComponent,
    AppSubMenu,
    AppTopBar,
    AppFooter,
    AppRightPanel,
    InlineProfileComponent,
    AppLoadingOverlayComponent,
    DashboardDemoComponent,
    MainComponent,
    DraftsComponent    
  ],
  providers: [
     TranslateService,
     CarService,
     CountryService,
     EventService,
     NodeService,
     ApprovalflowService    
  ]
})
export class MainModule { }
