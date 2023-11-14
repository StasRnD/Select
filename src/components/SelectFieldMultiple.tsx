import { SelectFieldMultipleProps } from "../model";
import { SelectChip } from "./SelectChip";
import React from "react";
import { SelectChipWrapper } from "./SelectChipWrapper";
import { twMerge } from "tailwind-merge";

export const SelectFieldMultiple = <T extends unknown>(
  props: SelectFieldMultipleProps<T>,
) => {
  const {
    value,
    handleChange,
    clearOptions,
    handleRemoveAllOptions,
    open,
    openDropdownToggle,
    findValue,
    findLabel,
    search,
    inputValue,
    handleInputChange,
    viewCountChildren,
  } = props;

  return (
    <div
      onClick={openDropdownToggle}
      className={twMerge(
        "flex gap-y-2 border rounded-lg hover:border-blue-600 cursor-pointer",
        open && "outline outline-2 outline-blue-400",
      )}
    >
      <SelectChipWrapper
        search={search}
        open={open}
        inputValue={inputValue}
        handleInputChange={handleInputChange}
        viewCountChildren={viewCountChildren}
      >
        {value.length
          ? value.map((el) => {
              return (
                <SelectChip
                  key={findValue(el)}
                  label={findLabel(el)}
                  onClickRemove={(evt: React.MouseEvent<SVGElement>) => {
                    evt.stopPropagation();
                    handleChange(el);
                  }}
                />
              );
            })
          : !search && <span className={"p-2 rounded-lg"}>Выбирай</span>}
      </SelectChipWrapper>

      {!!value.length && clearOptions && (
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
