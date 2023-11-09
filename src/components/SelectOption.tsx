import React from "react";
import { twMerge } from "tailwind-merge";
import { SelectOptionProps } from "../model";

export const SelectOption: React.FC<SelectOptionProps> = (props) => {
  const { multiple, label, active, onClick } = props;

  return (
    <div
      onClick={onClick}
      className={twMerge(
        "bg-amber-400 p-2 rounded-lg cursor-pointer hover:bg-amber-600",
        active && multiple && "bg-blue-400",
        active && !multiple && "bg-blue-700 text-white",
      )}
    >
      {multiple && <input type="checkbox" checked={active} />}
      <span>{label}</span>
    </div>
  );
};
