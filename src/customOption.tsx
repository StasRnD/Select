import { twMerge } from "tailwind-merge";
import React from "react";
import { SelectOptionProps } from "./model";
interface CustomOptionProps extends SelectOptionProps {
  title: string;
  description: string;
}

export const CustomOption: React.FC<CustomOptionProps> = (props) => {
  const { onClick, active } = props;
  return (
    <div
      onClick={onClick}
      className={twMerge(
        "flex gap-x-2 p-2 rounded-lg hover:cursor-pointer w-full hover:bg-gray-400",
        active && "bg-blue-400 hover:bg-blue-700",
      )}
    >
      <div className={"p-4 bg-green-400 rounded-full self-center"}></div>
      <div className={"flex flex-col justify-between"}>
        <span>{props.title}</span>
        <span>{props.description}</span>
      </div>
      <input type="checkbox" checked={active} />
    </div>
  );
};
