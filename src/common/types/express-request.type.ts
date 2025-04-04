import { Request } from 'express';
import { JwtPayload } from '../../auth/interface/JwtPayload.interface';

declare module 'express' {
  export interface Request {
    user?: JwtPayload;
  }
}