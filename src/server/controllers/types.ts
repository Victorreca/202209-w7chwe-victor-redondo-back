export interface Credentials {
  name: string;
  password: string;
  picture: string;
}

export interface CustomRequest extends Request {
  userId: string;
}
