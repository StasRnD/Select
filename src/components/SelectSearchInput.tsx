import React from "react";
export interface SelectSearchInputProps {
  open: boolean;
  inputValue: string | undefined;
  handleInputChange:
    | ((evt: React.ChangeEvent<HTMLInputElement>) => void)
    | undefined;
}

export const SelectSearchInput: React.FC<SelectSearchInputProps> = ({
  open,
  inputValue,
  handleInputChange,
}) => {
  return (
    <input
      defaultChecked={false}
      onClick={(evt: React.MouseEvent<HTMLInputElement>) =>
        open && evt.stopPropagation()
      }
      className={"focus:outline-0 grow p-2 rounded-lg"}
      value={inputValue}
      onChange={handleInputChange}
      placeholder={"Поиск..."}
    />
  );
};
