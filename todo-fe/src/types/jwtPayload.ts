// src/types/jwtPayload.d.ts
declare module "jwt" {
  export interface JwtPayload {
    id: string;
    email: string;
    role: string;
  }
}
