import { Component, OnInit } from "@angular/core";
import { BaseComponent } from "../../../../../common/components/base.component";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { InlandRemittanceInstrument } from "../../../../../services/inland-remittance/instrument/domain/inland.remittance.instrument.models";
import { ActivatedRoute, Router } from "@angular/router";
import { SelectItem } from 'primeng/api';
import { PaymentMethod } from "../../../../../common/domain/inland.remittance.payment.method.enum.model";
import { InlandRemittanceInstrumentPaymentInfo } from "../../../../../services/inland-remittance/issue/domain/inland.remittance.issue.payment.models";


@Component({
    selector: 'payment-issue',
    templateUrl: './payment.inland.remittance.issue.component.html',
    styleUrls: ['./payment.inland.remittance.issue.component.scss']
})
export class PaymentIssueComponent extends BaseComponent implements OnInit {

    inlandRemittanceInstrument: InlandRemittanceInstrument = new InlandRemittanceInstrument();
    inlandRemittanceInstrumentPaymentInfo: InlandRemittanceInstrumentPaymentInfo = new InlandRemittanceInstrumentPaymentInfo()
    paymentIssueForm: FormGroup;
    type = [];
    id: number;
    paymentMethod: SelectItem[] = PaymentMethod;

    constructor(private route: ActivatedRoute,
        private formBuilder: FormBuilder,
        private router: Router) {
        super();
    }

    ngOnInit(): void {
        this.preparePaymentIssueForm(this.inlandRemittanceInstrumentPaymentInfo);
    }

    setData(data) {
        this.id = data.id;
        this.inlandRemittanceInstrument = data;
        console.log(data);
    }

    preparePaymentIssueForm(inlandRemittanceInstrumentPaymentInfo: InlandRemittanceInstrumentPaymentInfo) {
        this.paymentIssueForm = this.formBuilder.group({
            payeeNid: [inlandRemittanceInstrumentPaymentInfo.payeeNid, [Validators.required]],
            paymentMethod: [inlandRemittanceInstrumentPaymentInfo.paymentMethod, [Validators.required]],
            payeeAccountNo: [inlandRemittanceInstrumentPaymentInfo.payeeAccountNo, [Validators.required]],
            paymentRemark: [inlandRemittanceInstrumentPaymentInfo.paymentRemark, [Validators.required]]
        });
    }
}