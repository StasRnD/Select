import React from "react";
import { SelectFieldSingleProps } from "../model";
import { SelectSearchInput } from "./SelectSearchInput";

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
    handleRemoveAllOptions,
    clearOptions,
  } = props;
  return (
    <div
      onClick={openDropdownToggle}
      className={`flex gap-y-2 border rounded-lg hover:border-blue-600 cursor-pointer ${
        open && "outline outline-2 outline-blue-400"
      }`}
    >
      {search ? (
        <SelectSearchInput
          open={open}
          inputValue={inputValue}
          handleInputChange={handleInputChange}
        />
      ) : (
        <span className={"p-2 rounded-lg grow"}>
          {findLabel(value) || "Выбирай"}
        </span>
      )}
      {value && clearOptions && (
        <button
          className={
            "ml-auto bg-transparent border-l-2 px-4 hover:bg-blue-400 hover:text-white"
          }
          onClick={(evt: React.MouseEvent<HTMLButtonElement>) => {
            evt.stopPropagation();
            handleRemoveAllOptions();
          }}
        >
          Вытереть значение
        </button>
      )}
      <button
        className={
          "ml-auto bg-transparent border-l-2 px-4 rounded-r-lg hover:bg-blue-400 hover:text-white"
        }
      >
        {!open ? "открыть dropdown" : "закрыть dropdown"}
      </button>
    </div>
  );
};
