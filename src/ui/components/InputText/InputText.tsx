import React, { FunctionComponent } from 'react';

import $ from './InputText.module.css';

export interface InputTextProps {
  name: string;
  placeholder: string;
  value: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  extraProps: React.InputHTMLAttributes<HTMLInputElement>;
}

const InputText: FunctionComponent<InputTextProps> = ({
  name,
  onChange,
  placeholder,
  value,
  extraProps,
}) => {
  return (
    <input
      aria-label={name}
      className={$.inputText}
      name={name}
      onChange={onChange}
      placeholder={placeholder}
      type="text"
      value={value}
      {...extraProps}
    />
  );
};

export default InputText;
