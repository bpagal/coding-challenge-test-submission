import { Address as AddressType } from '@/types';
import { useState } from 'react';

export type FormValues = Pick<
  AddressType,
  'postcode' | 'houseNumber' | 'firstName' | 'lastName'
> & {
  selectedAddress: string;
};

const initialValues: FormValues = {
  postcode: '',
  houseNumber: '',
  firstName: '',
  lastName: '',
  selectedAddress: '',
};

export const useAddressFormValues = () => {
  const [formValues, setFormValues] = useState<FormValues>(initialValues);

  const handleFormValueChange = (formName: keyof FormValues) => {
    return (event: React.ChangeEvent<HTMLInputElement>) => {
      setFormValues((prev) => ({
        ...prev,
        [formName]: event.target.value,
      }));
    };
  };

  const resetFormValues = () => setFormValues(initialValues);

  return {
    formValues,
    handleFormValueChange,
    resetFormValues,
  };
};
