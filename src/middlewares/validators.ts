import { Injectable, BadRequestException } from '@nestjs/common';
import { ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments } from 'class-validator';

@Injectable()
@ValidatorConstraint({ name: 'likeStatus', async: false })
export class LikeStatusValidator implements ValidatorConstraintInterface {
  validate(value: any, args: ValidationArguments) {
    if (!value || typeof value !== 'string') {
      throw new BadRequestException({ message: 'likeStatus is not a string', field: 'likeStatus' });
    }

    const trimmedValue = value.trim();

    if (trimmedValue !== 'None' && trimmedValue !== 'Like' && trimmedValue !== 'Dislike') {
      throw new BadRequestException({ message: 'likeStatus has wrong format', field: 'likeStatus' });
    }

    return true;
  }

  defaultMessage(args: ValidationArguments) {
    return 'Invalid likeStatus';
  }
}
