import { Injectable, BadRequestException } from '@nestjs/common';
import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
  isURL,
  ValidationOptions,
  registerDecorator,
  isString,
} from 'class-validator';
import { CustomisableException } from '../exceptions/custom.exceptions';
import { CheckService } from '../other.services/check.service';

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
    // Проверка с использованием декоратора @IsUrl()
    const isUrlValid = isURL(value, {
      require_protocol: true,
      protocols: ['http', 'https'],
    });

    if (!isUrlValid) {
      return false;
    }

    // Дополнительная проверка по паттерну
    return this.urlRegex.test(value);
  }

  defaultMessage(args: ValidationArguments) {
    return `${args.property} must be a valid URL`;
  }
}

export function IsCustomUrl(validationOptions?: ValidationOptions) {
  return function (object: Record<string, any>, propertyName: string) {
    registerDecorator({
      name: 'isCustomUrl',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: CustomUrlValidator,
    });
  };
}
@Injectable()
@ValidatorConstraint({ name: 'BlogIdCustomValidator', async: true })
export class CustomBlogIdValidator implements ValidatorConstraintInterface {
  constructor(private readonly checkService: CheckService) {}

  async validate(value: any, args: ValidationArguments) {
    // Проверка с использованием декоратора @IsString
    const isBlogIdString = isString(value);

    if (!isBlogIdString) {
      return false;
    }
    console.log('value ', value);
    // Дополнительная проверка по паттерну
    return await this.checkService.isBlogExist(value);
  }

  defaultMessage(args: ValidationArguments) {
    return `${args.property} must be existing blog`;
  }
}

export function BlogIdCustomValidator(validationOptions?: ValidationOptions) {
  return function (object: Record<string, any>, propertyName: string) {
    registerDecorator({
      name: 'IsBlogIdExist',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: CustomBlogIdValidator,
    });
  };
}
