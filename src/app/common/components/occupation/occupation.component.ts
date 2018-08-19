import { OnInit, OnChanges, Component, Input, SimpleChanges } from "@angular/core";
import { FormGroup, Validators, FormBuilder } from "@angular/forms";
import { Occupation } from "../../../services/cis/domain/individual.model";
import { CISService } from "../../../services/cis/service-api/cis.service";
import { Location } from "@angular/common";
import { BaseComponent } from "../base.component";

@Component({
    selector: 'occupation-component',
    templateUrl: './occupation.component.html',
})

export class OccupationComponent extends BaseComponent implements OnInit {
    occupationForm: FormGroup;
    addedOccupations: Occupation[] = [];
    addedOccupation: Occupation;
    occupationTypes: any[];
    occupationMap: Map<number, string> = new Map();
    occupationRequired = false;
    @Input() inputoccupations: Occupation[];
    @Input('viewMode') viewMode:boolean;

    ngOnInit() {
        this.viewMode = this.viewMode ? this.viewMode : false;
        if (this.inputoccupations) {
            this.addedOccupations = this.inputoccupations;
        }
        this.prepareOccupationForm();
    }
    // ngOnChanges(changes: SimpleChanges) { 
    //     if(changes.viewMode){
    //         this.viewMode = changes.viewMode.currentValue;
    //     }
    // }
    constructor(private cisService: CISService,
        private formBuilder: FormBuilder) {
        super();
    }
    prepareOccupationForm() {
        this.occupationForm = this.formBuilder.group({
            occupationId: [null, [Validators.required]],
            occupationDetails: [null, [Validators.maxLength(30)]],
        });
        this.occupationForm.updateValueAndValidity();
        this.fetchOccupations();
    }
    fetchOccupations() {
        this.subscribers.fetchOccupationSub = this.cisService.fetchOccupations().subscribe(
            data => {
                this.occupationTypes = data.content;

                this.occupationTypes.forEach(element => {
                    this.occupationMap.set(element.id, element.name);
                });
                this.occupationForm.updateValueAndValidity();
            }
        );
    }

    addOccupation() {
        if (this.occupationForm.get('occupationId').value && this.addedOccupations.length < 5) {
            this.addedOccupation = new Occupation();
            this.addedOccupation.description = this.occupationForm.get('occupationDetails').value;
            this.addedOccupation.occupationTypeId = this.occupationForm.get('occupationId').value;
            this.addedOccupations = [this.addedOccupation, ...this.addedOccupations];
            this.occupationForm.get('occupationDetails').reset();
            this.occupationForm.get('occupationId').reset();
            this.occupationRequired = false;
        }
    }
    deleteOccupation(index) {
        let temp = Object.assign([], this.addedOccupations);
        temp.splice(index, 1);
        this.addedOccupations = Object.assign([], temp);
        if(this.addedOccupations.length < 1 ) {
            this.occupationRequired = true;
        }
    }
}