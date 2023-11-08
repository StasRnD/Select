import { Select } from "./Select";
import React, { useState } from "react";

interface UserOption {
  id: number;
  name: string;
}

const options: UserOption[] = [
  {
    id: 1,
    name: "Stas",
  },
  {
    id: 2,
    name: "Папа 30лет",
  },
  {
    id: 3,
    name: "Сын 4года",
  },
  {
    id: 4,
    name: "Сын 2года",
  },
];

function App() {
  const [selectValue, setSelectValue] = useState<UserOption | null>(null);
  const getLabel = (userOption: UserOption | null): string => {
    if (userOption === null) {
      return "";
    }
    if (!!userOption) {
      return userOption.name;
    }
    throw new Error("Ошибка");
  };

  const getValue = (userOption: UserOption | null): string | number => {
    if (userOption === null) {
      return "";
    }
    if (!!userOption) {
      return userOption.id;
    }
    throw new Error("Ошибка");
  };

  return (
    <div className="App">
      <Select
        value={selectValue}
        getLabel={getLabel}
        getValue={getValue}
        onChange={setSelectValue}
        options={options}
        search
        multiple={false}
      />
    </div>
  );
}

export default App;
