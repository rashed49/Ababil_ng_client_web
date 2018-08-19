import { Component, OnInit, SimpleChanges, Input } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { SelectItem } from 'primeng/api';
import { BaseComponent } from "../../../../../common/components/base.component";
import { InlandRemittanceLotService } from "../../../../../services/inland-remittance/lot/service-api/inland.remittance.lot.service";
import { InlandRemittanceLot } from "../../../../../services/inland-remittance/lot/domain/inland.remittance.lot.models";
import { CurrencyRestriction } from "../../../../../common/domain/currency.enum.model";


@Component({
    selector: 'lot-create',
    templateUrl: './create.inland.remittance.lot.component.html'
})

export class CreateLotComponent extends BaseComponent implements OnInit {
    display: boolean = false;
    InstrumentType = [];
    lotForm: FormGroup;
    inlandRemittanceProduct: any[] = [];
    id: number;
    leafArray: number[] = [];
    inlandRemittanceLot: InlandRemittanceLot = new InlandRemittanceLot();
    currencyCode: any[] = [];

    constructor(private lotService: InlandRemittanceLotService,
        private formBuilder: FormBuilder) {
        super();
    }

    ngOnInit(): void {
        this.fetchInlandRemittanceProductType();
        this.prepareLotForm(this.inlandRemittanceLot);
    }

    prepareLotForm(formData: InlandRemittanceLot) {
        if (!formData) { formData = new InlandRemittanceLot(); }
        this.lotForm = this.formBuilder.group({
            inlandRemittanceProductId: [formData.inlandRemittanceProduct.id, [Validators.required]],
            startLeafNo: [formData.startLeafNo, [Validators.required, Validators.min(1)]],
            endLeafNo: [formData.endLeafNo, [Validators.required, Validators.min(0)]],
            noOfLeaf: [formData.noOfLeaf, [Validators.required, Validators.min(1)]],
            branch: [formData.branch],
            currencyCode: [formData.currencyCode, [Validators.required]]
        });

        this.lotForm.get('startLeafNo').valueChanges.subscribe(val => {
            this.lotForm.get('endLeafNo').setValidators([
                Validators.min(this.lotForm.get('startLeafNo').value)]);
            this.leafArray[0] = +val;
        });
        this.lotForm.get('inlandRemittanceProductId').valueChanges.subscribe(
            val => {
                if (val != null) {
                    this.lotService.fetchInlandRemittanceCurrency({ productId: val }).subscribe(data => {
                        this.currencyCode = [{ label: 'Choose Remittance Currency  Type', value: null }].concat(data.map(element => {
                            return { label: element.currencyCode, value: element.currencyCode }
                        }));
                    });
                }
            });

        if (this.lotForm.get('inlandRemittanceProductId').value != null) {
            this.lotService.fetchInlandRemittanceCurrency({ productId: this.lotForm.get('inlandRemittanceProductId').value }).subscribe(data => {
                console.log(data);
                this.currencyCode = [{ label: 'Choose Remittance Currency  Type', value: null }].concat(data.map(element => {
                    return { label: element.currencyCode, value: element.currencyCode }
                }));
            });
        }
    }

    isValid(changedInput: string) {
        if (changedInput === 'noOfLeaf') {
            if (this.lotForm.controls['startLeafNo'].value) {
                this.lotForm.controls['endLeafNo'].setValue(+this.lotForm.controls['startLeafNo'].value - 1 + +this.lotForm.controls['noOfLeaf'].value);
            }
        }
        else if (changedInput === 'endLeafNo') {
            if (this.lotForm.controls['startLeafNo'].value) {
                this.lotForm.controls['noOfLeaf'].setValue(+this.lotForm.controls['endLeafNo'].value - +this.lotForm.controls['startLeafNo'].value + 1);
            }
        }
    }

    fetchInlandRemittanceProductType() {
        this.subscribers.fetchLotSub = this.lotService
            .fetchInlandRemittanceProduct()
            .subscribe(res => {
                this.inlandRemittanceProduct = [{ label: 'Choose Remittance Product type', value: null }].concat(res.map(element => {
                    return { label: element.name, value: element.id }
                }));
            });
    }

    showDialog() {
        this.display = true;
    }

    extractData() {
        let inlandRemittanceLot: any;
        inlandRemittanceLot = this.lotForm.value;
        this.inlandRemittanceLot.id = this.id;
        this.inlandRemittanceLot.endLeafNo = inlandRemittanceLot.endLeafNo;
        this.inlandRemittanceLot.startLeafNo = inlandRemittanceLot.startLeafNo;
        this.inlandRemittanceLot.noOfLeaf = inlandRemittanceLot.noOfLeaf;
        this.inlandRemittanceLot.currencyCode = inlandRemittanceLot.currencyCode;
        this.inlandRemittanceLot.inlandRemittanceProduct.id = inlandRemittanceLot.inlandRemittanceProductId;

        return this.inlandRemittanceLot;
    }
    setData(data) {
        if (data.id) {
            this.id = data.id;
        } else {
            this.lotForm.reset();
            this.currencyCode = [];
        }
        this.prepareLotForm(data);
    }

}