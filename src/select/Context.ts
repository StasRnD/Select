import React, {createContext} from "react";

export interface ContextProps {
    isOpenDropdown: boolean,
    openDropdownToggle: VoidFunction
    selectedValue: string | number
    onChange: (value: string | number) => void
    disabled?: boolean
    onChangeInput: (evt: React.ChangeEvent<HTMLInputElement>) => void
    inputValue: string | number,
    handleRemoveSelectValue: (evt: React.MouseEvent<HTMLButtonElement>) => void
}

export const Context = createContext<ContextProps>({} as ContextProps)