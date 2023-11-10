import React from "react";
import { SelectFieldSingleProps } from "../model";

export const SelectFieldSingle = <T extends unknown>(
  props: SelectFieldSingleProps<T>,
) => {
  const {
    open,
    openDropdownToggle,
    search,
    inputValue,
    handleInputChange,
    findLabel,
    value,
  } = props;
  return (
    <div
      onClick={openDropdownToggle}
      className={`flex gap-y-2 border rounded-lg hover:border-blue-600 cursor-pointer ${
        open && "outline outline-2 outline-blue-400"
      }`}
    >
      {search ? (
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
      ) : (
        <span className={"p-2 rounded-lg grow"}>
          {findLabel(value) || "Выбирай"}
        </span>
      )}
    </div>
  );
};
