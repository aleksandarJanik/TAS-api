import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from "class-validator";
import { UserService } from "src/user/user.service";

@ValidatorConstraint({ name: "EmailExists", async: true })
@Injectable()
export class EmailExistsRule implements ValidatorConstraintInterface {
  constructor(@Inject(forwardRef(() => UserService)) private readonly userService: UserService) {}

  async validate(email: string) {
    try {
      await this.userService.emailValidaton(email);
    } catch (e) {
      return false;
    }

    return true;
  }

  defaultMessage(args: ValidationArguments) {
    return `Email already exists!`;
  }
}
