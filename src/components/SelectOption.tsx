import React from "react";
import { twMerge } from "tailwind-merge";
import { SelectOptionProps } from "../model";

export const SelectOption = <T extends unknown>(
  props: SelectOptionProps<T>,
) => {
  const {
    multiple,
    LeftSlot,
    RightSlot,
    findLabel,
    item,
    active,
    onClick,
    withCheckbox,
  } = props;

  return (
    <div
      onClick={onClick}
      className={twMerge(
        "bg-amber-400 p-2 rounded-lg cursor-pointer hover:bg-amber-600 flex gap-x-2",
        active && multiple && "bg-blue-400",
        active && !multiple && "bg-blue-700 text-white",
      )}
    >
      {LeftSlot && <LeftSlot item={item} active={active} />}
      {withCheckbox && (
        <input type="checkbox" defaultChecked={false} checked={active} />
      )}
      <span>{findLabel(item)}</span>
      {RightSlot && <RightSlot item={item} active={active} />}
    </div>
  );
};
