import {Select} from "./Select";
import React, {useState} from 'react'




interface UserOption {
    value: number,
    label: string
    user?: string

}

const options: UserOption[] = [
    {
        value: 1,
        label: 'Мама 27лет',
        user: 'Stas'
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
    const [selectValue, setSelectValue] = useState<UserOption | null>(null)
    const handleChange = (value: UserOption | null) => setSelectValue(value)
    const getLabel = (userOption:UserOption) => userOption.label

    return (
        <div className="App">
            <Select value={selectValue} getLabel={getLabel} onChange={handleChange} options={options} search/>
        </div>
    );
}

export default App;
