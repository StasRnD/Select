import React, {useState} from 'react';
import {SelectFieldSingle} from "./select/components/SelectFieldSingle";
import {SelectOption} from "./select/components/SelectOption";
import {Select} from './select/Select';


function App() {
    const [valueSelect, setValueSelect] = useState<string | number>('1')
    const handleChangeSelect = (value: string | number) => setValueSelect(value)

    return (
        <div className="App">
            <Select onChange={handleChangeSelect} value={valueSelect}
                    selectField={<SelectFieldSingle/>}>
                    <SelectOption label={'Лейбл1'} value={1}>Лейбл1</SelectOption>
                    <SelectOption label={'Лейбл2'} value={2}>Лейбл2</SelectOption>
                    <SelectOption label={'Лейбл3'} value={3}> Лейбл3</SelectOption>
            </Select>
        </div>
    );
}

export default App;
