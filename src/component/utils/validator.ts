import { registerDecorator, ValidationOptions } from 'class-validator';
import { isMatch } from 'date-fns';

export function IsDateFormat(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isDateFormat',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [],
      options: validationOptions,
      validator: {
        validate(value: string) {
          return isMatch(value, 'yyyy-MM-dd');
        },
      },
    });
  };
}
