import {Select} from "./Select";
import React, {useState} from 'react'

export interface Option {
    value: string | number,
    label: string,
}

const options: Option[] = [
    {
        value: 1,
        label: 'Вариант 1'
    },
    {
        value: 2,
        label: 'Вариант 2'
    },
    {
        value: 3,
        label: 'Вариант 3'
    }
]
function App() {
    const [selectValue, setSelectValue] = useState({} as Option)
    const handleChange = (value: Option) => setSelectValue(value)

    return (
        <div className="App">
            <Select selectValue={selectValue} onChange={handleChange} options={options}/>
        </div>
    );
}

export default App;
