interface AuthUser {
  id: number;
  name: string;
  email: string;
  roles: string[];
}

declare namespace Express {
  export interface Request {
    user: AuthUser;
  }
}
