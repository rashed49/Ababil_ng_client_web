import { Component, OnInit } from "@angular/core";
import { InlandRemittanceLot } from "../../../../../../services/inland-remittance/lot/domain/inland.remittance.lot.models";
import { ActivatedRoute, Router } from "@angular/router";
import { ApprovalflowService } from "../../../../../../services/approvalflow/service-api/approval.flow.service";
import { NotificationService } from "../../../../../../common/notification/notification.service";
import { InlandRemittanceLotService } from "../../../../../../services/inland-remittance/lot/service-api/inland.remittance.lot.service";
import { ViewsBaseComponent } from "../../../../view.base.component";
import { Location } from '@angular/common';
import { Observable, of } from "rxjs";
import { InlandRemittanceInstrumentReIssueInfo } from "../../../../../../services/inland-remittance/issue/domain/inland.remittance.reissue.models";
import { ExchangeRateService } from "../../../../../../services/currency/service-api/exchange.rate.service";
import { CurrencyService } from "../../../../../../services/currency/service-api/currency.service";

@Component({
    selector: 'reissue-view',
    templateUrl: './inland.remittance.reissue.view.component.html'
})
export class InlandRemittanceReissueViewComponent extends ViewsBaseComponent implements OnInit {

    inlandRemittanceInstrumentReIssueInfo: InlandRemittanceInstrumentReIssueInfo = new InlandRemittanceInstrumentReIssueInfo();
    queryParams: any;
    inlandRemittanceLot: InlandRemittanceLot = new InlandRemittanceLot();
    inlandRemittanceProductType: string = "";
    remittanceProductTypeMap: Map<number, any> = new Map();
    productId: number;
    rateType: number;
    base_currency: string;
    BasedExchangeRate: number = 1;
    chequeDate: Date;
    exchangeRateTypeMap: Map<number, any> = new Map();
    exchangeRateType: string = "";
    showExchangeRate: boolean = false;

    constructor(private route: ActivatedRoute,
        protected workflowService: ApprovalflowService,
        protected router: Router,
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
                    this.inlandRemittanceInstrumentReIssueInfo = data;
                    this.productId = this.inlandRemittanceInstrumentReIssueInfo.productId;
                    this.rateType = this.inlandRemittanceInstrumentReIssueInfo.rateType;
                    this.chequeDate = new Date(this.inlandRemittanceInstrumentReIssueInfo.chequeDate);
                    this.BasedExchangeRate = this.inlandRemittanceInstrumentReIssueInfo.exchangeRate > 0 ? this.inlandRemittanceInstrumentReIssueInfo.exchangeRate : 1;

                    if (this.base_currency == this.inlandRemittanceInstrumentReIssueInfo.currencyCode) {
                        this.showExchangeRate = false;
                    } else {
                        this.showExchangeRate = true;
                    }
                    console.log(this.inlandRemittanceInstrumentReIssueInfo);

                    if (this.inlandRemittanceInstrumentReIssueInfo) {
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