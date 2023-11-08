import React from "react";

interface SelectOptionProps {
  multiple?: boolean;
  label: string;
  active?: boolean;
  onClick: VoidFunction;
}

export const SelectOption: React.FC<SelectOptionProps> = (props) => {
  const { multiple, label, active, onClick } = props;

  return (
    <div
      onClick={onClick}
      className={
        "bg-amber-400 p-2 rounded-lg cursor-pointer hover:bg-amber-600"
      }
    >
      {multiple && <input type="checkbox" checked={active} />}
      <span>{label}</span>
    </div>
  );
};
