import { Injectable, BadRequestException } from '@nestjs/common';
import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';
import { CustomisableException } from '../exceptions/custom.exceptions';

@Injectable()
@ValidatorConstraint({ name: 'likeStatus', async: false })
export class LikeStatusValidator implements ValidatorConstraintInterface {
  validate(value: any, args: ValidationArguments) {
    if (!value || typeof value !== 'string') {
      throw new BadRequestException({
        message: 'likeStatus is not a string',
        field: 'likeStatus',
      });
    }

    const trimmedValue = value.trim();

    if (
      trimmedValue !== 'None' &&
      trimmedValue !== 'Like' &&
      trimmedValue !== 'Dislike'
    ) {
      throw new CustomisableException(
        'likeStatus',
        "LikeStatus should be 'None', 'Like' or 'Dislike' ",
        400,
      );
    }

    return true;
  }

  defaultMessage(args: ValidationArguments) {
    return 'Invalid likeStatus';
  }
}

@Injectable()
@ValidatorConstraint({ name: 'customUrl', async: false })
export class CustomUrlValidator implements ValidatorConstraintInterface {
  private readonly urlRegex =
    /^https:\/\/([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$/;

  validate(value: any, args: ValidationArguments) {
    if (!value || typeof value !== 'string') {
      throw new BadRequestException({
        message: 'URL is required',
        field: args.property,
      });
    }

    if (!this.urlRegex.test(value)) {
      throw new BadRequestException({
        message: 'Invalid URL format',
        field: args.property,
      });
    }

    return true;
  }

  defaultMessage(args: ValidationArguments) {
    return `${args.property} must be a valid URL`;
  }
}
