import { Select } from "./Select";
import React, { useState } from "react";
import { CustomOption } from "./customs/CustomOption";
import { CustomSelectField } from "./customs/CustomSelectField";

interface colourOptionsProps {
  value: string;
  label: string;
  color: string;
}
const colourOptions: colourOptionsProps[] = [
  { value: "ocean", label: "Ocean", color: "#00B8D9" },
  { value: "blue", label: "Blue", color: "#0052CC" },
  { value: "purple", label: "Purple", color: "#5243AA" },
  { value: "red", label: "Red", color: "#FF5630" },
  { value: "orange", label: "Orange", color: "#FF8B00" },
  { value: "yellow", label: "Yellow", color: "#FFC400" },
  { value: "green", label: "Green", color: "#36B37E" },
  { value: "forest", label: "Forest", color: "#00875A" },
  { value: "slate", label: "Slate", color: "#253858" },
  { value: "silver", label: "Silver", color: "#666666" },
];

interface flavourOptionsProps {
  value: string;
  label: string;
  rating: string;
}
const flavourOptions: flavourOptionsProps[] = [
  { value: "vanilla", label: "Vanilla", rating: "safe" },
  { value: "chocolate", label: "Chocolate", rating: "good" },
  { value: "strawberry", label: "Strawberry", rating: "wild" },
];

interface groupedOptionsProps {
  groupName: string;
  groupOptions: colourOptionsProps[] | flavourOptionsProps[];
}
const groupedOptions: groupedOptionsProps[] = [
  {
    groupName: "Colours",
    groupOptions: colourOptions,
  },
  {
    groupName: "Flavours",
    groupOptions: flavourOptions,
  },
];

function App() {
  const [selectValue, setSelectValue] = useState<
    (colourOptionsProps | flavourOptionsProps)[]
  >([]);
  const getLabel = (
    userOption: colourOptionsProps | flavourOptionsProps | null,
  ): string => {
    if (userOption === null) {
      return "";
    } else {
      return "color" in userOption ? userOption.color : userOption.rating;
    }
  };

  const getValue = (
    userOption: colourOptionsProps | flavourOptionsProps | null,
  ): string | number => {
    if (userOption === null) {
      return "";
    } else {
      return userOption.value;
    }
  };

  return (
    <div className={"flex flex-col gap-y-60"}>
      <Select
        value={selectValue}
        getLabel={getLabel}
        getValue={getValue}
        onChange={setSelectValue}
        options={groupedOptions}
        multiple={true}
        grouped={true}
        clearOptions
        search
        showOptionChoseAll
        hasDeletableOptions
      />
    </div>
  );
}

export default App;
