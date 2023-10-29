import {Select} from "./Select";
import React, {useState} from 'react'
import {Option} from './Select'


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
    const [selectValue, setSelectValue] = useState<Option['value'] | null>(null)
    const handleChange = (value: Option['value'] | null) => setSelectValue(value)

    return (
        <div className="App">
            <Select value={selectValue} onChange={handleChange} options={options}/>
        </div>
    );
}

export default App;
