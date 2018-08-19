import {Subject} from "./subject.model"
import {Organization} from "./organization.model"

export class InstituteOwnerInformation {
    id              : number;
    ownerTypeId     : number;
    owner           : Subject;
    organization    : Organization;
    sharePercentage : number;
}