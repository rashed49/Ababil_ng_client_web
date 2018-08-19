export let OwnerTypes = [{ label: 'Individual', value: 'INDIVIDUAL' },
{ label: 'Organization', value: 'ORGANIZATION' }];

export interface Owner {
    getOwnerTypeId(): number;
    setOwnerTypeId(ownerTypeId: number): void;
    getSharePercentage(): number;
    setSharePercentage(sharePercentage: number): void;
    getType(): string;
    getId();
}
