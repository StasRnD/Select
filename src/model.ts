import React from "react";

export interface SelectOptionProps<T> {
  multiple?: boolean;
  item: T;
  findLabel: (option: T) => string;
  active?: boolean;
  onClick: VoidFunction;
  selectHasCustomOption?: boolean;
  LeftItem?: React.FC<{ item: T; active: boolean | undefined }>;
  RightItem?: React.FC<{ item: T; active: boolean | undefined }>;
  withCheckbox?: boolean;
}

export interface MultiSelect<T> {
  multiple: true;
  value: T[];
  onChange: (value: T[]) => void;
}
export interface SingleSelect<T> {
  multiple: false;
  value: T | null;
  onChange: (value: T | null) => void;
}

type SelectFieldProps<T> = {
  handleChange: (option: T) => void;
  findLabel: (option: T | null) => string;
  findValue: (option: T | null) => string | number;
  open: boolean;
  openDropdownToggle: VoidFunction;
  search?: boolean;
  inputValue?: string;
  handleInputChange?: (evt: React.ChangeEvent<HTMLInputElement>) => void;
  clearOptions?: boolean;
  handleRemoveAllOptions: VoidFunction;
};

export type SelectFieldSingleProps<T> = SingleSelect<T> & SelectFieldProps<T>;

export type SelectFieldMultipleProps<T> = MultiSelect<T> & SelectFieldProps<T>;
