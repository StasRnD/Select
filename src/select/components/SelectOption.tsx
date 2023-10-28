import React, {PropsWithChildren, useContext} from "react";
import {twMerge} from "tailwind-merge";
import {Context} from "../Context";

interface SelectOptionProps {
    label: string
    value: string | number
}

export const SelectOption: React.FC<PropsWithChildren<SelectOptionProps>> = (props) => {
    const {children, value} = props

    const {onChange, openDropdownToggle, selectedValue} = useContext(Context)
    const handleChange = () => {
        onChange(value)
        openDropdownToggle()
    }

    const active = selectedValue === +value

    return <div onClick={handleChange}
                className={twMerge(`rounded-lg p-2 hover:bg-blue-300 cursor-pointer`, active && 'bg-blue-500 hover:bg-blue-700 text-white')}>{children}</div>
}