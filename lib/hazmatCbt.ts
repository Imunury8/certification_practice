import { HAZMAT_CHEM_CBT } from "./hazmatChemCbt";
import { HAZMAT_FIRE_CBT } from "./hazmatFireCbt";
import { HAZMAT_MATERIALS_CBT } from "./hazmatMaterialsCbt";

export interface HazmatCbtQuestion {
  id: string;
  prompt: string;
  choices: readonly [string, string, string, string];
  correctIndex: 0 | 1 | 2 | 3;
  explanation: string;
}

export const HAZMAT_CBT_SET_SIZE = 20;

export const HAZMAT_CBT_SUBJECTS = [
  { id: "chemistry", name: "물질의 물리·화학적 성질", questions: HAZMAT_CHEM_CBT },
  { id: "fire", name: "화재예방과 소화방법", questions: HAZMAT_FIRE_CBT },
  { id: "materials", name: "위험물의 성질 및 취급", questions: HAZMAT_MATERIALS_CBT },
] as const;
