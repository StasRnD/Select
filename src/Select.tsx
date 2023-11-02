import React, {useEffect, useState, useMemo} from "react";

export interface Option {
    value: string | number,
    label: string,
}

interface SelectProps<T> {
    value: T | null
    onChange: (value: T) => void
    options: T[]
    search?: boolean;
    getLabel?: (value: T | null) => string
}


const toLowerCaseAndTrim = (value: string): string => {
    return value.toLowerCase().trim()
}
export const Select = <T = Option>(props: SelectProps<T>) => {
    const {value, onChange, options, search, getLabel} = props
    const openDropdownToggle = () => setOpen(!open)
    const [open, setOpen] = useState<boolean>(false)
    const [inputValue, setInputValue] = useState<string>('')
    const handleInputChange = (evt: React.ChangeEvent<HTMLInputElement>) => setInputValue(evt.target.value)

    function checkLabel<T>(option: T): string {
        if (option === null) {
            return ''
        }
        if (typeof option === 'object' && 'label' in option) {
            return String(option.label)
        }
        throw Error('нет Option')

    }

    const findLabel = (option: T | null): string => getLabel ? getLabel(option) : checkLabel(option)

    useEffect(() => {
        setInputValue('')
    }, [open])

    const filterOptions = useMemo(() => {
        return !search ? options : options
            .filter((option) => {
                return toLowerCaseAndTrim(findLabel(option)).includes(toLowerCaseAndTrim(inputValue))
            })
    }, [search, inputValue])


    return (
        <div className={'flex flex-col gap-x-y relative'}>
            <div onClick={openDropdownToggle}
                 className={`flex flex-col gap-y-2 border p-2 rounded-lg hover:border-blue-600 cursor-pointer ${open && 'outline outline-2 outline-blue-400'}`}>
                <span>{findLabel(value) || 'Выбирай'}</span>
                {search && open && <input onClick={(evt: React.MouseEvent<HTMLInputElement>) => evt.stopPropagation()}
                                          className={'focus:outline-0'} value={inputValue} onChange={handleInputChange}
                                          placeholder={'Поиск...'}/>}
            </div>

            {open &&
                <div className={'absolute top-full mt-3 w-full flex flex-col gap-y-3 border p-2 rounded-lg'}>
                    {filterOptions.length ? filterOptions.map((option) => {
                        const handleSelectChange = () => {
                            onChange(option)
                            openDropdownToggle()
                        }
                        return (
                            <div onClick={handleSelectChange}
                                 className={'bg-amber-400 p-2 rounded-lg cursor-pointer hover:bg-amber-600'}>
                                <span>{findLabel(option)}</span>
                            </div>
                        )
                    }) : <p>Ничего не найдено</p>
                    }
                </div>
            }
        </div>
    )
}