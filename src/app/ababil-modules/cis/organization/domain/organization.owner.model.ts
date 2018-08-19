import { Organization } from '../../../../services/cis/domain/organization.model'
import { Owner } from './organization.owner';

export class OrganizationOwner extends Organization implements Owner {

    ownerTypeId: number;
    sharePercentage: number;

    getOwnerTypeId(): number {
        return this.ownerTypeId;
    }

    setOwnerTypeId(ownerTypeId: number): void {
        this.ownerTypeId = ownerTypeId;
    }

    public getSharePercentage(): number {
        return this.sharePercentage;
    }

    public setSharePercentage(sharePercentage: number): void {
        this.sharePercentage = sharePercentage;
    }

    // @Override
    public getType(): string {
        return 'ORGANIZATION';
    }
    constructor(organization: Organization, ownerTypeId: number, sharePercentage: number) {
        super();
        this.name = organization.name;
        this.businessAddress = organization.businessAddress;
        this.businessDetails = organization.businessDetails;
        this.contactInformation = organization.contactInformation;
        this.factoryAddress = organization.factoryAddress;
        this.ownerTypeId = ownerTypeId;
        this.sharePercentage = sharePercentage;
        this.identityInformations = organization.identityInformations;
    }

    getId() {
        return this.id;
    }
}
