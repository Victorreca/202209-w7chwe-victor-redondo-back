import type { JwtPayload } from "jsonwebtoken";
export interface RegisterData {
  name: string;
  password: string;
  picture?: string;
}

export interface UserTokenPayload extends JwtPayload {
  id: string;
  username: string;
}

export interface CustomRequest extends Request {
  userId: string;
}
