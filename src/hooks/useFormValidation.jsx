// hooks/useFormValidation.jsx
import { useState } from 'react';

export const useFormValidation = (initialErrors = {}) => {
  const [validationErrors, setValidationErrors] = useState(initialErrors);
  
  const validateField = (name, value, rules) => {
    if (rules.required && (!value || (typeof value === 'string' && !value.trim()))) {
      return `${name} is required`;
    }
    
    if (rules.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      return 'Invalid email format';
    }
    
    if (rules.minLength && value.length < rules.minLength) {
      return `${name} must be at least ${rules.minLength} characters`;
    }
    
    if (rules.custom && typeof rules.custom === 'function') {
      return rules.custom(value);
    }
    
    return null;
  };
  
  const validateForm = (form, validationRules) => {
    const errors = {};
    
    Object.keys(validationRules).forEach((fieldName) => {
      const error = validateField(
        fieldName, 
        form[fieldName], 
        validationRules[fieldName]
      );
      
      if (error) {
        errors[fieldName] = error;
      }
    });
    
    setValidationErrors(errors);
    return errors;
  };
  
  const clearError = (fieldName) => {
    if (validationErrors[fieldName]) {
      setValidationErrors(prev => ({
        ...prev,
        [fieldName]: undefined
      }));
    }
  };
  
  return { 
    validationErrors, 
    validateForm, 
    clearError,
    setValidationErrors
  };
};