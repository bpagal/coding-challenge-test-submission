import { ButtonType, ButtonVariant } from '@/types';
import React, { FunctionComponent } from 'react';

import styles from './Button.module.css';
import Spinner from './Spinner';

interface ButtonProps {
  onClick?: () => void;
  type?: ButtonType;
  variant?: ButtonVariant;
  loading?: boolean;
  children: React.ReactNode;
}

const Button: FunctionComponent<ButtonProps> = ({
  children,
  onClick,
  type = 'button',
  variant = 'primary',
  loading = false,
}) => {
  return (
    <button
      // - Display loading spinner per demo video. NOTE: add data-testid="loading-spinner" for spinner element (used for grading)
      className={`${styles.button} ${styles[variant]}`}
      data-testid="loading-spinner"
      type={type}
      onClick={onClick}
      disabled={loading}
    >
      <div className={styles.wrapper}>
        {loading && <Spinner />}
        {children}
      </div>
    </button>
  );
};

export default Button;
