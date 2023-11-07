import React, {useEffect, useState, useMemo, useRef} from "react";
import {useOutsideClick} from './hooks'
import {SelectOption} from './components/SelectOption'
import {SelectChipWrapper} from "./components/SelectChipWrapper";
import {SelectChip} from "./components/SelectChip";

export interface Option {
    value: string | number,
    label: string,
}

interface SelectProps<T> {
    value: T | null | any
    onChange: (value: T | null | any) => void
    options: T[]
    search?: boolean;
    getLabel?: (value: T | null) => string
    multiple?: boolean
}

const toLowerCaseAndTrim = (value: string): string => {
    return value.toLowerCase().trim()
}
export const Select = <T = Option>(props: SelectProps<T>) => {
    const {value, onChange, options, search, getLabel, multiple} = props
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

    //Массив строк - лейблы выбранных options
    const allActiveOption = useMemo(()=> {
        return multiple
            ? value.reduce((acc: any, option: any) => {
            return [...acc, findLabel(option)]
        }, [])
            : null


    },[value])

    //Ф-я возвращает true, если label переданного option есть в выбранных options (переменная allActiveOption)
    const activeOption = (option: any) => multiple ? allActiveOption.includes(findLabel(option)) : findLabel(option)



    //обработчик onChange в зависимости от того типа селекта(мульти или нет)
    //Принимает option. Если мультиселект, то проверяем выбранный option или нет
    // Если выбран, то отфильтровываем value(удаляем данный option из выбранных), если не выбран, то добавляем в value(выбранные option)
    const handleChange = (option: any) => {
        if (multiple) {
            if (activeOption(option)) {
                onChange(value.filter((el: any) => findLabel(el) !== findLabel(option)))
            } else {
                onChange([...value, option])
            }
        } else {
            onChange(option)
        }
    }
    //Вытереть все опции
    const handleRemoveAllOptions = (value: any) => {
        onChange(value)
    }

    useEffect(() => {
        setInputValue(findLabel(value))
    }, [search, value])

    useOutsideClick(ref, () => setOpen(false))

    return (
        <div ref={ref} className={'flex flex-col gap-x-y relative'}>
            <div onClick={openDropdownToggle}
                 className={`flex gap-y-2 border rounded-lg hover:border-blue-600 cursor-pointer ${open && 'outline outline-2 outline-blue-400'}`}>

                {!multiple && (search ?
                    <input onClick={(evt: React.MouseEvent<HTMLInputElement>) => open && evt.stopPropagation()}
                           className={'focus:outline-0 grow p-2 rounded-lg'} value={inputValue}
                           onChange={handleInputChange}
                           placeholder={'Поиск...'}/> :
                    <span className={'p-2 rounded-lg grow'}>{findLabel(value) || 'Выбирай'}</span>)}
                {multiple &&
                    <SelectChipWrapper viewCountChildren={2}>
                        {value.length ? value.map((el: any) => {
                            return <SelectChip label={findLabel(el)} onClickRemove={(evt: React.MouseEvent<SVGElement>) => {
                                evt.stopPropagation()
                                handleChange(el)
                            }}/>
                        }) : <span className={'p-2 rounded-lg'}>Выбирай</span>}

                    </SelectChipWrapper>}


                {(multiple ? !!value.length : value) &&
                    <button className={'ml-auto bg-transparent border-l-2 px-4 hover:bg-blue-400 hover:text-white'}
                            onClick={(evt: React.MouseEvent<HTMLButtonElement>) => {
                                evt.stopPropagation()
                                handleRemoveAllOptions(multiple ? [] : null)
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
                            handleChange(option)
                            !multiple && openDropdownToggle()
                        }
                        return <SelectOption
                            onClick={handleSelectChange}
                            label={findLabel(option)}
                            multiple={multiple}
                            active={activeOption(option)}
                        />
                    }) : <p>Ничего не найдено</p>
                    }
                </div>
            }
        </div>
    )
}