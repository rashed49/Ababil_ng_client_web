import { Component, OnInit } from "@angular/core";
import { ViewsBaseComponent } from "../../../../view.base.component";
import { ActivatedRoute, Router } from "@angular/router";
import { ApprovalflowService } from "../../../../../../services/approvalflow/service-api/approval.flow.service";
import { NotificationService } from "../../../../../../common/notification/notification.service";
import { Location } from '@angular/common';
import { InlandRemittanceInstrument } from "../../../../../../services/inland-remittance/instrument/domain/inland.remittance.instrument.models";
import { Observable, of } from "rxjs";
import { InlandRemittanceLot } from "../../../../../../services/inland-remittance/lot/domain/inland.remittance.lot.models";
import { InlandRemittanceLotService } from "../../../../../../services/inland-remittance/lot/service-api/inland.remittance.lot.service";
import { InlandRemittanceInstrumentIssueInfos } from "../../../../../../services/inland-remittance/issue/domain/inland.remittance.issue.models";
import { InlandRemittanceChargeInformations } from "../../../../../../services/inland-remittance/charge/domain/inland.remittance.charge.models";
import { SelectItem } from 'primeng/api';
import { ExchangeRateService } from "../../../../../../services/currency/service-api/exchange.rate.service";
import { CurrencyService } from "../../../../../../services/currency/service-api/currency.service";

@Component({
    selector: 'issue-view',
    templateUrl: './inland.remittance.issue.view.component.html'
})
export class InlandRemittanceIssueViewComponent extends ViewsBaseComponent implements OnInit {


    inlandRemittanceInstrumentIssueInfos = new InlandRemittanceInstrumentIssueInfos();
    inlandRemittanceChargeInformation: InlandRemittanceChargeInformations[] = [];
    queryParams: any;
    inlandRemittanceLot: InlandRemittanceLot = new InlandRemittanceLot();
    inlandRemittanceProductType: string = "";
    exchangeRateType: string = "";
    remittanceProductTypeMap: Map<number, any> = new Map();
    exchangeRateTypeMap: Map<number, any> = new Map();
    productId: number;
    rateType: number;
    showExchangeRate: boolean = false;
    base_currency: string;
    BasedExchangeRate: number = 1;
    chequeDate: Date;


    constructor(private route: ActivatedRoute,
        protected workflowService: ApprovalflowService
        , protected router: Router,
        protected notificationService: NotificationService,
        private lotService: InlandRemittanceLotService,
        protected location: Location,
        private exchangeRateService: ExchangeRateService,
        private currencyService: CurrencyService) {
        super(location, router, workflowService, notificationService);
    }

    ngOnInit(): void {
        this.fetchBaseCurrency();
        this.showVerifierSelectionModal = of(false);
        this.route.queryParams.subscribe(params => {
            this.queryParams = params;
            this.command = this.queryParams.command;
            this.taskId = this.queryParams.taskId;
            this.processId = this.queryParams.taskId;
            this.subscribers.fetchApprovalFlowTaskInstancePayloadSub = this.fetchApprovalFlowTaskInstancePayload()
                .subscribe(data => {
                    this.inlandRemittanceInstrumentIssueInfos = data;
                    this.productId = this.inlandRemittanceInstrumentIssueInfos.remittanceProductId;
                    this.rateType = this.inlandRemittanceInstrumentIssueInfos.rateType;
                    this.chequeDate = new Date(this.inlandRemittanceInstrumentIssueInfos.chequeDate);
                    this.BasedExchangeRate = this.inlandRemittanceInstrumentIssueInfos.exchangeRate > 0 ? this.inlandRemittanceInstrumentIssueInfos.exchangeRate : 1;

                    if (this.base_currency == this.inlandRemittanceInstrumentIssueInfos.instrumentCurrencyCode) {
                        this.showExchangeRate = false;
                    } else {
                        this.showExchangeRate = true;
                    }
                    if (this.inlandRemittanceInstrumentIssueInfos) {
                        this.subscribers.fetchLotSub = this.lotService
                            .fetchInlandRemittanceProduct()
                            .subscribe(res => {
                                res.forEach(element => {
                                    this.remittanceProductTypeMap.set(element.id, element.name);
                                    this.inlandRemittanceProductType = this.remittanceProductTypeMap.get(this.productId);
                                    console.log(this.inlandRemittanceProductType);
                                });
                            });

                        this.exchangeRateService.fetchExchangeRateTypes().subscribe(
                            data => {
                                (data.content).forEach(element => {
                                    this.exchangeRateTypeMap.set(element.id, element.typeName);
                                    this.exchangeRateType = this.exchangeRateTypeMap.get(this.rateType);
                                    console.log(this.exchangeRateType);
                                });

                            }
                        )
                    }
                });
        });
    }



    fetchBaseCurrency() {
        let urlQueryParamMap = new Map();
        urlQueryParamMap.set("name", "base-currency")
        this.subscribers.baseCurrencySub = this.currencyService.fetchBaseCurrency(urlQueryParamMap)
            .subscribe(data => {
                this.base_currency = data;
            });
    }


}
