import {
  AbstractControl,
  ValidationErrors,
  ValidatorFn,
  FormGroup,
  Validators,
} from '@angular/forms';

import { NzSafeAny } from 'ng-zorro-antd/core/types';

export type MyErrorsOptions = { 'zh-cn': string; en: string } & Record<
  string,
  NzSafeAny
>;
export type MyValidationErrors = Record<string, MyErrorsOptions>;

export class CustomValidators extends Validators {
  static patternValidator(regex: RegExp, error: ValidationErrors): ValidatorFn {
    return (control: AbstractControl) => {
      if (!control.value) {
        // if control is empty return no error
        return null;
      }

      // test the value of the control against the regexp supplied
      const valid = regex.test(control.value);

      // if true, return no error (no error), else return error passed in the second parameter
      return valid ? null : error;
    };
  }
  static contactNumberLength(name: string, length: number): ValidatorFn {
    return (control: AbstractControl): MyValidationErrors | null => {
      const value: string = control?.value;

      if (value && value.toString().length > length) {
        return {
          pattern: {
            'zh-cn': `最大长度为 `,
            en: `${name} should be less than ${length} digits`,
          },
        };
      }
      return null;
    };
  }
  static customRequiredno(name: string): ValidatorFn {
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
  static mustMatch(controlName: string, matchingControlName: string) {
    return (formGroup: FormGroup) => {
      const control = formGroup.controls[controlName];
      const matchingControl = formGroup.controls[matchingControlName];

      if (matchingControl.errors && !matchingControl.errors['mustMatch']) {
        // return if another validator has already found an error on the matchingControl
        return;
      }

      // set error on matchingControl if validation fails
      if (control.value !== matchingControl.value) {
        matchingControl.setErrors({ mustMatch: true });
      } else {
        matchingControl.setErrors(null);
      }
    };
  }

  static override minLength(minLength: number): ValidatorFn {
    return (control: AbstractControl): MyValidationErrors | null => {
      if (Validators.minLength(minLength)(control) === null) {
        return null;
      }
      return {
        minlength: {
          'zh-cn': `最小长度为 ${minLength}`,
          // en: `MinLength is ${minLength}`,
          en: `${name} should be greter than ${minLength} digits`,
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
      } else
        return {
          pattern: {
            'zh-cn': `最大长度为 `,
            en: `Please input ${name}`,
          },
        };
    };
  }
  static customSelectorRequired(name: string): ValidatorFn {
    return (control: AbstractControl): MyValidationErrors | null => {
      if (Validators.required(control) === null) {
        return null;
      } else
        return {
          pattern: {
            'zh-cn': `最大长度为 `,
            en: `Please Select your ${name}`,
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
  static phonenumValidator(allowPhoneNumber: boolean = false): ValidatorFn {
    return (control: AbstractControl): MyValidationErrors | null => {
      const value = control.value;
      if (isNaN(value)) {
        return {
          numValidator: {
            'zh-cn': '请输入有效数字',
            en: 'Please enter a valid number',
          },
        };
      }
      if (allowPhoneNumber && !/^\d{10}$/.test(value)) {
        return {
          numValidator: {
            'zh-cn': '请输入有效电话号码',
            en: 'Please enter a valid phone number',
          },
        };
      }

      return null;
    };
  }
  static numValidator(): ValidatorFn {
    return (control: AbstractControl): MyValidationErrors | null => {
      const value = control.value;
      if (isNaN(value)) {
        return {
          numValidator: {
            'zh-cn': '请输入有效数字',
            en: 'Please enter a valid number',
          },
        };
      }
      return null;
    };
  }
  static customRequiredForUpload(name: string): ValidatorFn {
    return (control: AbstractControl): MyValidationErrors | null => {
      if (Validators.required(control) === null) {
        return null;
      } else {
        return {
          upload: {
            'zh-cn': `请上传文件`,
            en: `Please upload ${name}`,
          },
        };
      }
    };
  }
  static customRequiredsalary(name: string): ValidatorFn {
    return (control: AbstractControl): MyValidationErrors | null => {
      if (Validators.required(control) === null) {
        return null;
      } else
        return {
          pattern: {
            'zh-cn': `最大长度为 `,
            en: `Please input ${name}`,
          },
        };
    };
  }

  static imageValidator(
    allowedTypes: string[] = ['image/jpeg', 'image/png', 'image/gif'],
    maxSizeInKB: number = 1024
  ): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const file: File = control.value;

      if (!file) {
        return null; // No file selected, validation passes.
      }

      // Check file type
      if (allowedTypes && allowedTypes.indexOf(file.type) === -1) {
        return {
          imageValidator: {
            valid: false,
            message: 'Please select a valid image file (JPEG, PNG, GIF).',
          },
        };
      }

      // Check file size
      if (file.size > maxSizeInKB * 1024) {
        return {
          imageValidator: {
            valid: false,
            message: `File size exceeds the maximum limit of ${maxSizeInKB}KB.`,
          },
        };
      }

      return null; // Validation passes.
    };
  }

  static customRequiredNumber(name: string): ValidatorFn {
    return (control: AbstractControl): MyValidationErrors | null => {
      if (Validators.required(control) === null) {
        return null;
      } else {
        return {
          customRequired: {
            'zh-cn': `最大长度为 ${name.length}`,
            en: `Please input a number for ${name}`,
          },
        };
      }
    };
  }

  // Add this custom validation for 4 letters followed by 7 alphanumeric characters
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

  static characterLength(name: string, maxLength: number): ValidatorFn {
    return (control: AbstractControl): MyValidationErrors | null => {
      if (
        control.value == null ||
        control.value == '' ||
        Validators.maxLength(maxLength)(control) === null
      ) {
        return null;
      }
      return {
        minlength: {
          'zh-cn': `最小长度为 ${maxLength}`,
          en: `${name} should have less than ${maxLength} characters`,
        },
      };
    };
  }

  static exactLength(name: string, length: number): ValidatorFn {
    return (control: AbstractControl): MyValidationErrors | null => {
      const value: string = control?.value;

      if (value && value.toString().length !== length) {
        return {
          pattern: {
            'zh-cn': `最大长度为 `,
            en: `${name} should be ${length} digits`,
          },
        };
      }
      return null;
    };
  }
  static alphanumericPattern(
    minLength: number = 5,
    maxLength: number = 12,
    pattern: RegExp = /^[a-zA-Z0-9 ]+$/
  ): ValidatorFn {
    return (control: AbstractControl): MyValidationErrors | null => {
      if (
        control.value == null ||
        control.value === '' ||
        (Validators.pattern(pattern)(control) === null &&
          Validators.maxLength(maxLength)(control) === null &&
          Validators.minLength(minLength)(control) === null)
      ) {
        return null;
      }

      return {
        alphanumeric: {
          'zh-cn': `请输入5到12个字母、数字或空格的组合`,
          en: `Enter ${minLength} to ${maxLength} alphanumeric characters`,
        },
      };
    };
  }

  static alphanumericPatternWithoutSpace(
    minLength: number = 8,
    maxLength: number = 11,
    pattern: RegExp = /^[a-zA-Z0-9]+$/
  ): ValidatorFn {
    return (control: AbstractControl): MyValidationErrors | null => {
      const value = control.value || '';

      // Check if value meets pattern, minLength, and maxLength
      const isPatternValid = Validators.pattern(pattern)(control) === null;
      const isMinLengthValid =
        Validators.minLength(minLength)(control) === null;
      const isMaxLengthValid =
        Validators.maxLength(maxLength)(control) === null;

      if (
        value === '' ||
        (isPatternValid && isMinLengthValid && isMaxLengthValid)
      ) {
        return null;
      }

      // Return custom error message if validation fails
      return {
        alphanumericWithoutSpace: {
          'zh-cn': `请输入8到11个字母和数字的组合`,
          en: `Enter ${minLength} to ${maxLength} alphanumeric characters`,
        },
      };
    };
  }
  static specificPattern(): ValidatorFn {
    const pattern: RegExp = /^[a-zA-Z]{4}[a-zA-Z0-9]{7}$/;

    return (control: AbstractControl): MyValidationErrors | null => {
      if (
        control.value == null ||
        control.value === '' ||
        Validators.pattern(pattern)(control) === null
      ) {
        return null;
      }

      return {
        specificPattern: {
          'zh-cn': `请输入4个字母，后跟7个字母或数字`,
          en: `Enter exactly 4 letters followed by 7 alphanumeric characters`,
        },
      };
    };
  }
}
