import React, {useEffect, useState, useMemo, useRef} from "react";
import {useOutsideClick} from './hooks'

export interface Option {
    value: string | number,
    label: string,
}

interface SelectProps<T> {
    value: T | null
    onChange: (value: T | null) => void
    options: T[]
    search?: boolean;
    getLabel?: (value: T | null) => string
}


const toLowerCaseAndTrim = (value: string): string => {
    return value.toLowerCase().trim()
}
export const Select = <T = Option>(props: SelectProps<T>) => {
    const {value, onChange, options, search, getLabel} = props
    const ref = useRef<HTMLDivElement>(null);
    const openDropdownToggle = () => setOpen(!open)
    const [open, setOpen] = useState<boolean>(false)
    const findLabel = (option: T | null): string => getLabel ? getLabel(option) : checkLabel(option)

    const [inputValue, setInputValue] = useState<string>(findLabel(value))
    const handleInputChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
        if (evt.target.value === '') {
            onChange(null)
        }
        setInputValue(evt.target.value)
    }

    function checkLabel<T>(option: T): string {
        if (option === null) {
            return ''
        }
        if (typeof option === 'object' && 'label' in option) {
            return String(option.label)
        }
        throw Error('нет Option')
    }

    const filterOptions = useMemo(() => {
        return !search || findLabel(value) === inputValue ? options : options
            .filter((option) => {
                return toLowerCaseAndTrim(findLabel(option)).includes(toLowerCaseAndTrim(inputValue))
            })
    }, [search, inputValue])


    useEffect(() => {
        setInputValue(findLabel(value))
    }, [search, value])

    useOutsideClick(ref, setOpen)

    return (
        <div ref={ref} className={'flex flex-col gap-x-y relative'}>
            <div onClick={openDropdownToggle}
                 className={`flex gap-y-2 border rounded-lg hover:border-blue-600 cursor-pointer ${open && 'outline outline-2 outline-blue-400'}`}>

                {search ? <input onClick={(evt: React.MouseEvent<HTMLInputElement>) => open && evt.stopPropagation()}
                                 className={'focus:outline-0 grow p-2 rounded-lg'} value={inputValue}
                                 onChange={handleInputChange}
                                 placeholder={'Поиск...'}/> :
                    <span className={'p-2 rounded-lg'}>{findLabel(value) || 'Выбирай'}</span>}
                {value &&
                    <button className={'ml-auto bg-transparent border-l-2 px-4 hover:bg-blue-400 hover:text-white'}
                            onClick={(evt: React.MouseEvent<HTMLButtonElement>) => {
                                evt.stopPropagation()
                                onChange(null)
                            }}>Вытереть значение</button>}

                <button
                    className={'ml-auto bg-transparent border-l-2 px-4 rounded-r-lg hover:bg-blue-400 hover:text-white'}>
                    {!open ? 'открыть dropdown' : 'закрыть dropdown'}
                </button>
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