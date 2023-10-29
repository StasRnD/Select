import {Select} from "./Select";
import React, {useState} from 'react'
import {Option} from './Select'


const options: Option[] = [
    {
        value: 1,
        label: 'Мама 27лет'
    },
    {
        value: 2,
        label: 'Папа 30лет'
    },
    {
        value: 3,
        label: 'Сын 4года'
    },
    {
        value: 4,
        label: 'Сын 2года'
    }
]
function App() {
    const [selectValue, setSelectValue] = useState<Option['value'] | null>(null)
    const handleChange = (value: Option['value'] | null) => setSelectValue(value)

    return (
        <div className="App">
            <Select value={selectValue} onChange={handleChange} options={options} search/>
        </div>
    );
}

export default App;
