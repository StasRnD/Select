import React, {useState} from "react";
import {Option} from "./App";

interface SelectProps {
    selectValue: Option
    onChange: (value: SelectProps['selectValue']) => void
    options: Option[]
}

export const Select: React.FC<SelectProps> = ({selectValue, onChange, options}) => {
    const [open, setOpen] = useState<boolean>(false)
    const openDropdownToggle = () => setOpen(!open)

    return (
        <div className={'flex flex-col gap-x-y relative'}>
            <div onClick={openDropdownToggle}
                 className={`border p-2 rounded-lg hover:border-blue-600 cursor-pointer ${open && 'outline outline-2 outline-blue-400'}`}>
                <span>{selectValue.label || 'Выбирай'}</span>
            </div>

            {open &&
                <div className={'absolute top-full mt-3 w-full flex flex-col gap-y-3 border p-2 rounded-lg'}>
                    {options.map((option) => {
                        const handleSelectChange = () => onChange(option)

                        return <div onClick={handleSelectChange}
                                    className={'bg-amber-400 p-2 rounded-lg cursor-pointer hover:bg-amber-600'}>
                            <span>{option.label}</span>
                        </div>
                    })}
                </div>}
        </div>)
}