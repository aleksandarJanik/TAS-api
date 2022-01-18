import { registerDecorator, ValidationOptions } from "class-validator";
import { EmailExistsRule } from "../custom-validators/emailExist.validator";
import { UserExistsRule } from "../custom-validators/userExist.validator";

export function EmailExists(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: "EmailExists",
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: EmailExistsRule,
    });
  };
}
