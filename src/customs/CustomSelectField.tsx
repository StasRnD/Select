import { SelectFieldSingleProps } from "../model";
import React from "react";
interface CustomSelectFieldProps {
  title: string;
  description: string;
}
export const CustomSelectField = (
  props: SelectFieldSingleProps<CustomSelectFieldProps>,
) => {
  const { value, openDropdownToggle } = props;
  return (
    <div
      onClick={openDropdownToggle}
      className={
        "flex border border-gray-500 bg-gray-300 p-2 rounded-lg hover:cursor-pointer"
      }
    >
      {value ? (
        <React.Fragment>
          <div className={"p-4 bg-green-400 rounded-full self-center"}></div>
          <div className={"flex flex-col justify-between"}>
            <span>{value?.title}</span>
            <span>{value?.description}</span>
          </div>
        </React.Fragment>
      ) : (
        <p>Выбирай</p>
      )}
    </div>
  );
};
