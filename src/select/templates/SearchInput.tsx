import React, {useContext} from 'react'
import {Context} from "../Context";

interface SearchInputProps {
    placeholder?: string;
}

export const SearchInput: React.FC<SearchInputProps> = ({placeholder}) => {

    const {isOpenDropdown, selectedValue, disabled, onChangeInput, inputValue} = useContext(Context)

    const handleClick = (evt: React.MouseEvent<HTMLInputElement>) => isOpenDropdown && evt.stopPropagation()
    return <input onChange={onChangeInput} onClick={handleClick} placeholder={placeholder}
                  className={`focus:outline-0 grow`} value={inputValue || selectedValue} disabled={disabled}/>

}