import { Request } from 'express';
import { IJwtPayload } from '../jwt-payload.interface';

export class AuthUtil {
  public static getPayloadFromRequest(req: Request): IJwtPayload {
    console.log(req.header('Authorization'));

    return null;
  }
}
