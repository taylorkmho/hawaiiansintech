import React from "react";
import theme from "styles/theme";
import { toKebab } from "../../helpers";
import Label from "./Label";

interface InputProps {
  defaultValue?: string;
  disabled?: boolean;
  error?: string;
  label?: string;
  labelTranslation?: string;
  labelHint?: string | React.ReactNode;
  name: string;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => any;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => any;
  onFocus?: (e: React.FocusEvent<HTMLInputElement>) => any;
  placeholder?: string;
  value?: string;
  tabIndex?: number;
}

export default function Input({
  defaultValue,
  disabled,
  error,
  label,
  labelTranslation,
  name,
  onBlur,
  onChange,
  onFocus,
  labelHint,
  placeholder,
  tabIndex,
  value,
}: InputProps) {
  const nameKebab = toKebab(name);
  return (
    <div className="input">
      {label && labelTranslation && (
        <div className="input__label">
          <Label
            htmlFor={nameKebab}
            label={label}
            labelTranslation={labelTranslation}
            hint={labelHint}
          />
        </div>
      )}
      <input
        defaultValue={defaultValue}
        id={nameKebab}
        placeholder={placeholder}
        name={name}
        type="text"
        tabIndex={tabIndex}
        onBlur={onBlur}
        onChange={onChange}
        onFocus={onFocus}
        value={value}
        disabled={disabled}
      />
      {error && <FieldError>{error}</FieldError>}

      <style jsx>{`
        input {
          width: 100%;
          padding: 0.5rem 0.75rem;
          font-size: 1.4rem;
          border-radius: ${theme.borderRadius.sm};
          border: 0.2rem solid transparent;
          border-color: ${error ? "red" : "transparent"};
          opacity: ${disabled ? "0.5" : "1"};
          background: ${theme.color.background.alt};
        }
        input::placeholder {
          color: ${theme.color.text.alt2};
        }
        input:disabled {
          border-color: ${theme.color.border.alt};
          pointer-events: none;
          background: none;
        }
        input:focus {
          border-color: ${theme.color.brand.base};
          box-shadow: ${theme.elevation.two.brand};
          background: white;
        }
        input:focus::placeholder {
          color: ${theme.color.text.alt3};
        }
        .input__label {
          display: inline-block;
          margin-bottom: 1rem;
        }
      `}</style>
    </div>
  );
}

export function FieldError({ children }: { children: React.ReactNode }) {
  return (
    <span>
      {children}
      <style jsx>{`
        span {
          display: block;
          margin-top: 0.25rem;
          font-size: 0.9rem;
          color: ${theme.color.text.error};
        }
      `}</style>
    </span>
  );
}
