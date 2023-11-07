import {Select} from "./Select";
import React, {useState} from 'react'

interface UserOption {
    id: number,
    name: string
}

const options: UserOption[] = [
    {
        id: 1,
        name: 'Stas'
    },
    {
        id: 2,
        name: 'Папа 30лет'
    },
    {
        id: 3,
        name: 'Сын 4года'
    },
    {
        id: 4,
        name: 'Сын 2года'
    }
]

function App() {
    const [selectValue, setSelectValue] = useState<UserOption | null | any>({
        id: 3,
        name: 'Сын 4года'
    })

    const getLabel = (userOption: UserOption | null) => {
        if (userOption === null) {
            return '';
        }
        if (!!userOption) {
            return userOption.name;
        }
        throw new Error('Ошибка');
    }

    return (
        <div className="App">
            <Select value={selectValue} getLabel={getLabel} onChange={setSelectValue} options={options} search/>
        </div>
    );
}

export default App;