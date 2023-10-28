import {SelectProps} from "./Select";
import React, {useState} from "react";

interface SelectReceiveProps extends SelectProps {
    isOpenDropdown: boolean,
    openDropdownToggle: VoidFunction
    onChangeInput: (evt: React.ChangeEvent<HTMLInputElement>) => void
    inputValue: string | number,
    handleRemoveSelectValue: (evt: React.MouseEvent<HTMLButtonElement>) => void
}
export const useGetPropsSelect = (props: SelectProps): SelectReceiveProps => {
    const {value, onChange, ...rest} = props
    const [isOpenDropdown, setOpenDropdown] = useState<boolean>(false)
    const [inputValue, setInputValue] = useState<string | number>(value)


    const handleChangeInput = (evt: React.ChangeEvent<HTMLInputElement>) => {
        if (evt.target.value === '') {
            onChange('')
        }
        setInputValue(evt.target.value)
    }

    const openDropdownToggle = () => {
        setOpenDropdown(!isOpenDropdown)
        isOpenDropdown && setInputValue('')
    }

    const handleRemoveSelectValue = (evt: React.MouseEvent<HTMLButtonElement>) => {
        evt.stopPropagation()
        onChange('')
        setInputValue('')

    }

    return {
        isOpenDropdown,
        openDropdownToggle,
        value,
        onChange,
        inputValue,
        onChangeInput: handleChangeInput,
        handleRemoveSelectValue,
        ...rest
    }

}