import { Component, OnInit, ViewChild } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { BaseComponent } from "../../../../common/components/base.component";
import { NotificationService } from "../../../../common/notification/notification.service";
import { LazyLoadEvent } from "primeng/components/common/lazyloadevent";
import { InlandRemittanceInstrument } from "../../../../services/inland-remittance/instrument/domain/inland.remittance.instrument.models";
import { InlandRemittanceInstrumentService } from "../../../../services/inland-remittance/instrument/service-api/inland.remittance.instrument.service";
import { InlandRemittanceLotService } from "../../../../services/inland-remittance/lot/service-api/inland.remittance.lot.service";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { RemittanceInstrumentStatus } from "../../../../common/domain/inland.remittance.instrument.status.enum.model";
import { InlandRemittanceInstrumentDestroyInfo } from "../../../../services/inland-remittance/instrument/domain/inland.remittance.instrument.destroy.models";
import { DataTable } from "primeng/datatable";


@Component({
    selector: 'instrument-list',
    templateUrl: './inland.remittance.instrument.list.component.html',
    styleUrls: ['./inland.remittance.instrument.list.component.scss']
})
export class InstrumentListComponent extends BaseComponent implements OnInit {

    @ViewChild('destroyInstrument') destroyInstrument: any;
    @ViewChild('createIssue') createIssue: any;

    instrumentSearchForm: FormGroup;
    id: number;
    instrument: InlandRemittanceInstrument;
    inlandRemittanceInstrument: InlandRemittanceInstrument[] = [];
    inlandRemittanceInstruments: InlandRemittanceInstrument = new InlandRemittanceInstrument();
    inlandRemittanceInstrumentDestroyInfo: InlandRemittanceInstrumentDestroyInfo = new InlandRemittanceInstrumentDestroyInfo();

    remittanceProductTypeMap: Map<number, any> = new Map();
    urlSearchMap: Map<string, any> = new Map();

    displayCreateIssue: boolean = false;
    displayDestroyInstrument: boolean = false;

    totalRecords: number;
    totalPages: number;
    selected: any;

    constructor(private instrumentService: InlandRemittanceInstrumentService,
        private lotService: InlandRemittanceLotService,
        private router: Router,
        private route: ActivatedRoute,
        private notificationService: NotificationService,
        private formBuilder: FormBuilder) {
        super();
    }

    ngOnInit(): void {
        this.fetchInlandRemittanceInstruments(this.urlSearchMap);
        this.fetchInlandRemittanceProductType();
        this.prepareInlandInstrumentSearchForm();
    }

    fetchInlandRemittanceInstruments(searchMap: Map<string, any>) {
        this.subscribers.fatchInstrumentSub = this.instrumentService
            .fetchInlandRemittanceInstruments(searchMap)
            .subscribe(data => {
                this.inlandRemittanceInstrument = data.content;
                this.totalRecords = (data.pageSize * data.pageCount);
                this.totalPages = data.pageCount;
                console.log(data);
            });

    }
    loadInlandRemittanceInstrumentsLazily(event: LazyLoadEvent) {
        if (this.urlSearchMap == null) {
            this.urlSearchMap = new Map();
        }
        this.urlSearchMap.set("page", (event.first / 20));
        this.fetchInlandRemittanceInstruments(this.urlSearchMap);
    }

    fetchInlandRemittanceProductType() {
        this.subscribers.fatchInlandRemittanceProductSub = this.lotService
            .fetchInlandRemittanceProduct()
            .subscribe(res => {
                res.forEach(element => {
                    this.remittanceProductTypeMap.set(element.id, element.name);
                    console.log(this.remittanceProductTypeMap);
                });
            });
    }
    createInlandRemittanceIssue() {
        this.router.navigate(['Issue-create'], { relativeTo: this.route });
    }
    destroyInlandRemittanceInstrument(data) {
        this.destroyInstrument.setData(data);
        this.displayDestroyInstrument = true;
    }

    InlandRemittanceInstrumentDestroy(instrumentToDestroy) {
        this.subscribers.InlandRemittanceInstrumentSaveSub = this.instrumentService
            .deleteInlandRemittanceInstrument(instrumentToDestroy).subscribe((data) => {
                this.notificationService.sendSuccessMsg("inland.remittance.instrument.destroy.success");
                this.displayDestroyInstrument = false;
                this.fetchInlandRemittanceInstruments(new Map());
                this.destroyInstrument.prepareInstrumentDestroyForm();
            });
    }

    saveInlandRemittanceInstrumentDestroy() {
        this.markFormGroupAsTouched(this.destroyInstrument.instrumentDestroyForm);
        if (this.destroyInstrument.instrumentDestroyForm.invalid) return;
        this.inlandRemittanceInstrumentDestroyInfo.currencyCode = this.destroyInstrument.inlandRemittanceInstrument.currencyCode;
        this.inlandRemittanceInstrumentDestroyInfo.productId = this.destroyInstrument.inlandRemittanceInstrument.inlandRemittanceProduct.id;
        this.inlandRemittanceInstrumentDestroyInfo.instrumentNo = this.destroyInstrument.inlandRemittanceInstrument.instrumentNo + "";
        this.inlandRemittanceInstrumentDestroyInfo.destroyRemark = this.destroyInstrument.instrumentDestroyForm.get('destroyRemark').value;
        this.InlandRemittanceInstrumentDestroy(this.inlandRemittanceInstrumentDestroyInfo);
    }

    cancelDestroyInstrument() {
        this.displayDestroyInstrument = false;
        this.destroyInstrument.instrumentDestroyForm.reset();
    }
    cancelCreateIssue() {
        this.displayCreateIssue = false;
        this.createIssue.createIssueForm.reset();
    }
    back() {
        this.router.navigate(['../../'], { relativeTo: this.route });
    }
    refreash(dt: DataTable) {
        dt.reset();
        this.fetchInlandRemittanceInstruments(this.urlSearchMap);
    }

    prepareInlandInstrumentSearchForm() {
        this.instrumentSearchForm = this.formBuilder.group({
            instrumentNo: ['', [Validators.maxLength(15)]],
            inlandRemittanceProductId: ['', [Validators.maxLength(10)]],
            status: ['', [Validators.maxLength(20)]],
            currencyCode:['',Validators.maxLength(10)]
        });
    }
    inlandRemittanceInstrumentsearch(searchMap: Map<string, any>) {
        
                if (searchMap != null) this.urlSearchMap = searchMap;
                for (let control in this.instrumentSearchForm.controls) {
                    this.urlSearchMap.delete(control);
                    let formControlValue: string = this.instrumentSearchForm.get(control).value.trim();
                    if (formControlValue.length !== 0)
                        this.urlSearchMap.set(control, this.instrumentSearchForm.get(control).value);
                }
                // this.urlSearchMap.set("page", 0);
                // this.subscribers.inlandRemittanceSearchSub = this.inlandRemittanceIssueService
                //     .searchInlandRemittanceIssue(this.urlSearchMap)
                //     .subscribe(data => {
                //         console.log(data);
                //         this.inlandRemittanceInstrument = data.content;
                        // this.totalRecords = (data.pageSize * data.pageCount);
                        // this.totalPages = data.pageCount;
                  // });
            }
}