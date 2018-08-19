import { TellerAllocationSaveEvent } from "./teller.allocation.form.component";
import { TellerAllocation } from "../../../../../services/teller/domain/teller.models";

export function maptellerAllocation(tellerAllocationSaveEvent: TellerAllocationSaveEvent):TellerAllocation{
    let tellerAllocation: TellerAllocation = {
       id : tellerAllocationSaveEvent.tellerAllocationForm.id,
       allocatedTo: tellerAllocationSaveEvent.tellerAllocationForm.allocatedTo,
       autoAllocate: tellerAllocationSaveEvent.tellerAllocationForm.autoAllocate,
       allocationDate: tellerAllocationSaveEvent.tellerAllocationForm.allocationDate,
       teller: tellerAllocationSaveEvent.tellerAllocationForm.teller
    }

    return tellerAllocation;
}