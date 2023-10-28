import React, {useContext} from 'react'
import {Chevron} from "../templates/Chevron";
import {ResetValue} from "../templates/ResetValue";
import {SearchInput} from "../templates/SearchInput";
import {Context} from "../Context";
import {twMerge} from "tailwind-merge";

interface SelectFieldSingleProps {
    isCombobox?: boolean
    placeholder?: string
}

export const SelectFieldSingle: React.FC<SelectFieldSingleProps> = (props) => {
    const {isCombobox, placeholder = 'Выбирай'} = props

    const {openDropdownToggle, isOpenDropdown, selectedValue, inputValue} = useContext(Context)

    return <div onClick={openDropdownToggle}
                className={twMerge('min-w-fit py-2 px-3 border-2 border-gray-500 rounded-lg flex items-center gap-x-1.5 hover:border-blue-600 hover:cursor-pointer', isOpenDropdown && 'outline outline-2 outline-blue-400 border-blue-600')}>

        {isCombobox ? <SearchInput placeholder={placeholder}/> :
            <span className={`grow ${!selectedValue && 'text-gray-400'}`}>{selectedValue || placeholder}</span>}
        {(selectedValue || inputValue) && <ResetValue/>}
        <Chevron/>
    </div>
}