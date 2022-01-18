import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from "class-validator";
import { UserService } from "src/user/user.service";

@ValidatorConstraint({ name: "UserExists", async: true })
@Injectable()
export class UserExistsRule implements ValidatorConstraintInterface {
  constructor(@Inject(forwardRef(() => UserService)) private readonly userService: UserService) {}

  async validate(userName: string) {
    try {
      await this.userService.userNameValidaton(userName);
    } catch (e) {
      return false;
    }

    return true;
  }

  defaultMessage(args: ValidationArguments) {
    return `Username already exists!`;
  }
}
