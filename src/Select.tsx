import React, {useEffect, useState} from "react";

export interface Option {
    value: string | number,
    label: string,
}

interface SelectProps {
    value: Option['value'] | null
    onChange: (value: Option['value']) => void
    options: Option[]
    search?: boolean;
}


const toLowerCaseAndTrim = (value: string): string => {
    return value.toLowerCase().trim()
}
export const Select: React.FC<SelectProps> = (props) => {
    const {value, onChange, options, search} = props
    const openDropdownToggle = () => setOpen(!open)
    const selectOption = options.find(option => option.value === value)
    const [open, setOpen] = useState<boolean>(false)
    const [inputValue, setInputValue] = useState<string>('')
    const handleInputChange = (evt: React.ChangeEvent<HTMLInputElement>) => setInputValue(evt.target.value)

    useEffect(() => {
        setInputValue('')
    }, [open])

    const filterOptions = options
        .filter((option) => {
            return toLowerCaseAndTrim(option.label).includes(toLowerCaseAndTrim(inputValue))
        })


    return (
        <div className={'flex flex-col gap-x-y relative'}>
            <div onClick={openDropdownToggle}
                 className={`flex flex-col gap-y-2 border p-2 rounded-lg hover:border-blue-600 cursor-pointer ${open && 'outline outline-2 outline-blue-400'}`}>
                <span>{selectOption?.label || 'Выбирай'}</span>
                {search && open && <input onClick={(evt: React.MouseEvent<HTMLInputElement>) => evt.stopPropagation()}
                                          className={'focus:outline-0'} value={inputValue} onChange={handleInputChange}
                                          placeholder={'Поиск...'}/>}
            </div>

            {open &&
                <div className={'absolute top-full mt-3 w-full flex flex-col gap-y-3 border p-2 rounded-lg'}>
                    {filterOptions.length ? filterOptions.map((option) => {
                        const handleSelectChange = () => {
                            onChange(option.value)
                            openDropdownToggle()
                        }
                        return (
                            <div onClick={handleSelectChange} key={option.value}
                                 className={'bg-amber-400 p-2 rounded-lg cursor-pointer hover:bg-amber-600'}>
                                <span>{option.label}</span>
                            </div>
                        )
                    }) : <p>Ничего не найдено</p>
                    }
                </div>
            }
        </div>
    )
}