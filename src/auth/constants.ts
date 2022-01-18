import { SetMetadata } from "@nestjs/common";

export const jwtConstants = {
  secret: "secretKey",
};

export const IS_PUBLIC_KEY = "isPublic";
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
export const RESET_PASSWORD_TOKEN_EXPIRATION_DAYS = 2;
export const ACTIVATE_USER_TOKEN_EXPIRATION_DAYS = 2;
