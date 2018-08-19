import { Component,OnInit} from "@angular/core";
import { FormGroup, FormBuilder } from "@angular/forms";
import { BaseComponent } from "../../../../../common/components/base.component";
import { NotificationService } from "../../../../../common/notification/notification.service";
import { InlandRemittanceInstrument } from "../../../../../services/inland-remittance/instrument/domain/inland.remittance.instrument.models";
import { InlandRemittanceIssueService } from "../../../../../services/inland-remittance/issue/service-api/inland.remittance.issue.service";


@Component({
    selector:'refund-issue',
    templateUrl:'./refund.inland.remittance.issue.component.html'
})
export class RefundIssueComponent extends BaseComponent implements OnInit{

    inlandRemittanceInstrument: InlandRemittanceInstrument = new InlandRemittanceInstrument();
    refundIssueForm: FormGroup;
    id: number;
   
    constructor(private formBuilder: FormBuilder,
        private inlandRemittanceIssueService: InlandRemittanceIssueService,
        private notificationService: NotificationService) {
        super();
    }
    ngOnInit(): void {
        this.prepareRefundIssueForm(this.inlandRemittanceInstrument);
    }

    setData(data) {
        this.id = data.id;
        this.inlandRemittanceInstrument = data;
        console.log(data);
    }

    prepareRefundIssueForm(inlandRemittanceInstrument: InlandRemittanceInstrument) {
        this.refundIssueForm = this.formBuilder.group({
            refundRemark: ['']
        });
    }
}