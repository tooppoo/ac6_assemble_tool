import {Validator} from "./base.ts";
import {failure, success, ValidationResult} from "./result.ts";
import {Assembly} from "~core/assemble/assembly.ts";
import {sum} from "~core/utils/array.ts";

export const notOverEnergyOutput: Validator = {
  validate(assembly: Assembly): ValidationResult {
    const totalEn = sum([
      assembly.rightArmUnit,
      assembly.leftArmUnit,
      assembly.head,
      assembly.core,
      assembly.arms,
      assembly.legs,
      assembly.booster,
      assembly.fcs,
    ].map(p => p.en_load))

    return assembly.generator.en_output >= totalEn
      ? success(assembly)
      : failure([new Error('EN output error')])
  },
}
