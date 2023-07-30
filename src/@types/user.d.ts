declare global {
  namespace Express {
    // eslint-disable-next-line @typescript-eslint/no-empty-interface
    export interface User extends ExtendUser {}
  }
}

export interface ExtendUser {
  googleId: string;
  username: string;
  email: string;
  grade: number;
  class: number;
  number: number;
}
