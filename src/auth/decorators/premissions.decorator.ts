import { SetMetadata } from "@nestjs/common";
import { PremissionType } from "../premission.type";

export const PREMISSION_KEY = 'authTypremissionpe';

export const Premissions = (...premissions: PremissionType[]) => 
    SetMetadata(PREMISSION_KEY, premissions )