import { Address as AddressType } from '@/types';
import { useState } from 'react';

export type FormValues = Pick<
  AddressType,
  'postcode' | 'houseNumber' | 'firstName' | 'lastName'
> & {
  selectedAddress: string;
};

export const useAddressFormValues = () => {
  const [formValues, setFormValues] = useState<FormValues>({
    postcode: '',
    houseNumber: '',
    firstName: '',
    lastName: '',
    selectedAddress: '',
  });

  const handleFormValueChange = (formName: keyof FormValues) => {
    return (event: React.ChangeEvent<HTMLInputElement>) => {
      setFormValues((prev) => ({
        ...prev,
        [formName]: event.target.value,
      }));
    };
  };

  return {
    formValues,
    handleFormValueChange,
  };
};
