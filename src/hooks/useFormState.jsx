// hooks/useFormState.jsx
import { useState } from 'react';

export const useFormState = (initialState = {}) => {
  const [formData, setFormData] = useState(initialState);
  
  const handleFormChange = (event) => {
    const { name, value, type, checked } = event.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };
  
  const updateForm = (updates) => {
    setFormData(prev => ({
      ...prev,
      ...updates
    }));
  };
  
  return { formData, handleFormChange, updateForm, setFormData };
};