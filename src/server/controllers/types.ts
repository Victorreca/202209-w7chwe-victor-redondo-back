import type { JwtPayload } from "jsonwebtoken";

export interface RegisterData {
  username: string;
  password: string;
  picture?: string;
}

export interface LoginData {
  username: string;
  password: string;
}

export interface UserTokenPayload extends JwtPayload {
  username: string;
  id: string;
}
