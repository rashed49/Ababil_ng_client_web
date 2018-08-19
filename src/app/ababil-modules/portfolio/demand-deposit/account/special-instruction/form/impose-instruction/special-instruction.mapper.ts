// import { SpecialInstructionSaveEvent } from "./impose.special.instruction.component";
// import { SpecialInstruction } from "../../../../../../../services/special-instruction/domain/special.instruction.models";

// export function mapSpecialInstructionCommands(specialInstructionSaveEvent:SpecialInstructionSaveEvent):SpecialInstruction{
//     let specialInstruction : SpecialInstruction = {
//        id : specialInstructionSaveEvent.specialInstructionForm.id,
//        demandDepositAccountId: specialInstructionSaveEvent.specialInstructionForm.demandDepositAccountId,
//        specialInstructionType: specialInstructionSaveEvent.specialInstructionForm.specialInstructionType,
//         chequeNumberFrom: specialInstructionSaveEvent.specialInstructionForm.chequeNumberFrom,
//         chequeNumberTo: specialInstructionSaveEvent.specialInstructionForm.chequeNumberTo,          
//           chequeAmount: specialInstructionSaveEvent.specialInstructionForm.chequeAmount,
//           lienAmount: specialInstructionSaveEvent.specialInstructionForm.lienAmount,
//           imposeDate: specialInstructionSaveEvent.specialInstructionForm.imposeDate,
//           withdrawDateTime: specialInstructionSaveEvent.specialInstructionForm.withdrawDateTime,
//           withdrawnBy: specialInstructionSaveEvent.specialInstructionForm.withdrawnBy,
//           description: specialInstructionSaveEvent.specialInstructionForm.description,
//           specialInstructionStatus:specialInstructionSaveEvent.specialInstructionForm.specialInstructionStatus
//     }

//     return specialInstruction;
// }