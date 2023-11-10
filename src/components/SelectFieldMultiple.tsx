import { SelectFieldMultipleProps } from "../model";
import { SelectChip } from "./SelectChip";
import React from "react";
import { SelectChipWrapper } from "./SelectChipWrapper";

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
  } = props;

  return (
    <div
      onClick={openDropdownToggle}
      className={`flex gap-y-2 border rounded-lg hover:border-blue-600 cursor-pointer ${
        open && "outline outline-2 outline-blue-400"
      }`}
    >
      <SelectChipWrapper viewCountChildren={2}>
        {value.length ? (
          value.map((el) => {
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
        ) : (
          <span className={"p-2 rounded-lg"}>Выбирай</span>
        )}
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
