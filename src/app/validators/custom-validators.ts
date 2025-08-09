import { AbstractControl, ValidatorFn, Validators } from '@angular/forms';
import { NzSafeAny } from 'ng-zorro-antd/core/types';

export type MyErrorsOptions = { 'zh-cn': string; en: string } & Record<
  string,
  NzSafeAny
>;
export type MyValidationErrors = Record<string, MyErrorsOptions>;

export class MyValidators extends Validators {
  static override minLength(minLength: number): ValidatorFn {
    return (control: AbstractControl): MyValidationErrors | null => {
      if (Validators.minLength(minLength)(control) === null) {
        return null;
      }
      return {
        minlength: {
          'zh-cn': `最小长度为 ${minLength}`,
          en: `MinLength is ${minLength}`,
        },
      };
    };
  }

  static override maxLength(maxLength: number): ValidatorFn {
    return (control: AbstractControl): MyValidationErrors | null => {
      if (Validators.maxLength(maxLength)(control) === null) {
        return null;
      }
      return {
        maxlength: {
          'zh-cn': `最大长度为 ${maxLength}`,
          en: `MaxLength is ${maxLength}`,
        },
      };
    };
  }

  static override pattern(pattern: any): ValidatorFn {
    return (control: AbstractControl): MyValidationErrors | null => {
      if (Validators.pattern(pattern)(control) === null) {
        return null;
      }
      return {
        pattern: {
          'zh-cn': `最大长度为 `,
          en: `Password must contain at least 8 characters with one Uppercase, one simple case, one number and one special character`,
        },
      };
    };
  }
  static patternURL(pattern: any): ValidatorFn {
    return (control: AbstractControl): MyValidationErrors | null => {
      if (Validators.pattern(pattern)(control) === null) {
        return null;
      }
      return {
        pattern: {
          'zh-cn': `最大长度为 `,
          en: `Enter correct URL`,
        },
      };
    };
  }
  static customEmail(pattern: any, name: string): ValidatorFn {
    return (control: AbstractControl): MyValidationErrors | null => {
      if (Validators.pattern(pattern)(control) === null) {
        return null;
      }
      return {
        pattern: {
          'zh-cn': `最大长度为 `,
          en: `${name} must be valid`,
        },
      };
    };
  }

  static customRequired(name: string): ValidatorFn {
    return (control: AbstractControl): MyValidationErrors | null => {
      if (Validators.required(control) === null) {
        return null;
      }
      return {
        pattern: {
          'zh-cn': `最大长度为 `,
          en: `Please input your ${name}`,
        },
      };
    };
  }
  static customConfirmPasswordRequired(name: string): ValidatorFn {
    return (control: AbstractControl): MyValidationErrors | null => {
      if (Validators.required(control) === null) {
        return null;
      }
      return {
        pattern: {
          'zh-cn': `最大长度为 `,
          en: `Please confirm your ${name}`,
        },
      };
    };
  }

  static monthValidator(): ValidatorFn {
    return (control: AbstractControl): MyValidationErrors | null => {
      const value = control.value;
      if (value && (isNaN(value) || value < 1 || value > 12)) {
        return {
          pattern: {
            'zh-cn': `最大长度为 `,
            en: `Month should be valid`,
          },
        };
      }
      return null;
    };
  }

  static alphanumericWithSpaces(
    minLength: number,
    maxLength: number
  ): ValidatorFn {
    return (control: AbstractControl): MyValidationErrors | null => {
      const value = control.value;
      const regex = new RegExp(`^[A-Za-z0-9 ]{${minLength},${maxLength}}$`);

      if (!value || regex.test(value)) {
        return null; // Valid input or empty
      } else {
        return {
          pattern: {
            'zh-cn': `输入的格式应为 ${minLength} 到 ${maxLength} 个字母或数字，并允许空格`,
            en: `Input should be ${minLength} to ${maxLength} alphanumeric characters, spaces allowed`,
          },
        };
      }
    };
  }

  static fourLettersSevenAlphanumeric(): ValidatorFn {
    return (control: AbstractControl): MyValidationErrors | null => {
      const value = control.value;
      const regex = /^[A-Za-z]{4}[A-Za-z0-9]{7}$/;

      if (!value || regex.test(value)) {
        return null; // Valid input or empty
      } else {
        return {
          pattern: {
            'zh-cn': '输入的格式应为 4 个字母后跟 7 个字母或数字',
            en: 'Input should be 4 letters followed by 7 alphanumeric characters',
          },
        };
      }
    };
  }
}
