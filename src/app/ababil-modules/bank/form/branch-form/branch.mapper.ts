import { Branch, OwnBranch, OtherBranch } from "../../../../services/bank/domain/bank.models";

export function mapOwnBranch(ownBranchSaveEvent: any): OwnBranch{
    let ownBranch: OwnBranch = {
        name: ownBranchSaveEvent.name,
        code: ownBranchSaveEvent.code,
        adCode: ownBranchSaveEvent.adCode,
        phoneNumber: ownBranchSaveEvent.phoneNumber,
        mobileNumber: ownBranchSaveEvent.mobileNumber,
        email: ownBranchSaveEvent.email,
        routingNumber: ownBranchSaveEvent.routingNumber,
        branchType: ownBranchSaveEvent.branchType,
        swiftCode: ownBranchSaveEvent.swiftCode,
        managerName: ownBranchSaveEvent.managerName,
        managerDesignation: ownBranchSaveEvent.managerDesignation,
        online: ownBranchSaveEvent.online,
        numberOfConcurrentUser: ownBranchSaveEvent.numberOfConcurrentUser,
        headOffice: ownBranchSaveEvent.headOffice       
    }
    return ownBranch;
}

export function mapOtherBranch(otherBranchSaveEvent: any): OtherBranch{
    let otherBranch: OtherBranch = {
        name: otherBranchSaveEvent.name,
        code: otherBranchSaveEvent.code,
        adCode: otherBranchSaveEvent.adCode,
        phoneNumber: otherBranchSaveEvent.phoneNumber,
        mobileNumber: otherBranchSaveEvent.mobileNumber,
        email: otherBranchSaveEvent.email,
        routingNumber: otherBranchSaveEvent.routingNumber   
    }
    return otherBranch;
}