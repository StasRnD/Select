import React from 'react'
import {twMerge} from "tailwind-merge";
import {SelectDropdown} from "./components/SelectDropdown";
import {Context, ContextProps} from "./Context";
import {useGetPropsSelect} from "./useGetPropsSelect";
export interface SelectProps {
    label?: string;
    explainText?: string;
    required?: boolean;
    disabled?: boolean;
    isError?: boolean;
    value: string | number;
    selectField: JSX.Element
    open?: boolean
    children: React.ReactNode | React.ReactNode[]
    onChange: (value: string | number) => void
}

export const Select: React.FC<SelectProps> = (props) => {
    const {
        label,
        required,
        selectField,
        isOpenDropdown,
        openDropdownToggle,
        children,
        explainText,
        isError,
        value,
        disabled,
        onChange,
        onChangeInput,
        inputValue,
        handleRemoveSelectValue,
    } = useGetPropsSelect(props)

    const selectContext: ContextProps = {
        openDropdownToggle,
        isOpenDropdown,
        selectedValue: value,
        onChange,
        disabled,
        onChangeInput,
        inputValue,
        handleRemoveSelectValue,
    }


    return (
        <div className={'flex flex-col gap-y-1.5 relative'}>
            <Context.Provider value={selectContext}>
                {label && <p>{label} {required && <span className={'text-red-500'}>*</span>}</p>}
                {selectField}
                {isOpenDropdown && <SelectDropdown>{children}</SelectDropdown>}
                {explainText &&
                    <p className={twMerge('text-gray-500 p-0', isError && 'text-red-500', isOpenDropdown && 'hidden')}>{explainText}</p>}
            </Context.Provider>

        </div>
    )
}