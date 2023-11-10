import React, {
  useEffect,
  useState,
  useMemo,
  useRef,
  useCallback,
} from "react";
import { useOutsideClick } from "./hooks";
import { SelectOption } from "./components/SelectOption";
import {
  SelectFieldMultipleProps,
  SelectFieldSingleProps,
  SelectOptionProps,
} from "./model";
import { checkValue, checkLabel } from "./utils";
import { SingleSelect, MultiSelect } from "./model";
import { SelectFieldMultiple } from "./components/SelectFieldMultiple";
import { SelectFieldSingle } from "./components/SelectFieldSingle";

type SelectProps<T> = {
  options: T[];
  search?: boolean;
  getLabel?: (value: T | null) => string;
  getValue?: (value: T | null) => string | number;
  customOption?: React.FC<SelectOptionProps<T>>;
  customSelectSingleField?: React.FC<SelectFieldSingleProps<T>>;
  customSelectMultiField?: React.FC<SelectFieldMultipleProps<T>>;
  clearOptions?: boolean;
} & (SingleSelect<T> | MultiSelect<T>);

const toLowerCaseAndTrim = (value: string): string => {
  return value.toLowerCase().trim();
};
export const Select = <V, T = V extends V[] ? V[number] : V>(
  props: SelectProps<T>,
) => {
  const {
    options,
    customOption,
    multiple,
    value,
    onChange,
    search,
    getLabel,
    getValue,
    clearOptions,
    customSelectSingleField,
    customSelectMultiField,
  } = props;

  const ref = useRef<HTMLDivElement>(null);
  const openDropdownToggle = () => setOpen((open) => !open);
  const [open, setOpen] = useState<boolean>(false);

  const findLabel = useCallback(
    (option: T | null): string =>
      getLabel ? getLabel(option) : checkLabel(option),
    [getLabel],
  );

  const findValue = useCallback(
    (value: T | null): string | number =>
      getValue ? getValue(value) : checkValue(value),
    [getValue],
  );

  const [inputValue, setInputValue] = useState<string>(
    !multiple ? findLabel(value) : "",
  );
  const handleInputChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
    if (evt.target.value === "" && !multiple) {
      onChange(null);
    }
    setInputValue(evt.target.value);
  };

  const filterOptions = useMemo(() => {
    return !search || findLabel(!multiple ? value : null) === inputValue
      ? options
      : options.filter((option) => {
          return toLowerCaseAndTrim(findLabel(option)).includes(
            toLowerCaseAndTrim(inputValue),
          );
        });
  }, [search, findLabel, multiple, value, inputValue, options]);

  //Массив строк - лейблы выбранных options
  const allActiveOptions = useMemo(() => {
    return multiple
      ? value.reduce(
          (acc: (string | number)[], value: T) => {
            return [...acc, findValue(value)];
          },
          [] as (string | number)[],
        )
      : null;
  }, [findValue, multiple, value]);

  //Ф-я возвращает true, если label переданного option есть в выбранных options (переменная allActiveOption)
  const activeOption = (option: T): boolean => {
    return multiple
      ? (allActiveOptions as (string | number)[]).includes(findValue(option))
      : findValue(option) === findValue(value);
  };

  //обработчик onChange в зависимости от того типа селекта(мульти или нет)
  //Принимает option. Если мультиселект, то проверяем выбранный option или нет
  // Если выбран, то отфильтровываем value(удаляем данный option из выбранных), если не выбран, то добавляем в value(выбранные option)
  const handleChange = (option: T) => {
    if (multiple) {
      if (activeOption(option)) {
        onChange(value.filter((el) => findValue(el) !== findValue(option)));
      } else {
        onChange([...value, option]);
      }
    } else {
      onChange(option);
    }
  };

  //Вытереть все опции
  const handleRemoveAllOptions = () => {
    if (multiple) {
      onChange([]);
    } else {
      onChange(null);
    }
  };

  useEffect(() => {
    if (!multiple) {
      setInputValue(findLabel(value));
    }
  }, [search, value, multiple, findLabel]);

  useOutsideClick(ref, () => setOpen(false));

  const OptionComponent = customOption ?? SelectOption;

  const SelectFieldSingleComponent =
    customSelectSingleField ?? SelectFieldSingle;
  const SelectFieldMultiComponent =
    customSelectMultiField ?? SelectFieldMultiple;
  console.log(!!customSelectSingleField);
  return (
    <div ref={ref} className={"flex flex-col gap-x-y relative"}>
      {multiple ? (
        <SelectFieldMultiComponent<T>
          value={value}
          handleChange={handleChange}
          multiple={multiple}
          findLabel={findLabel}
          findValue={findValue}
          search={search}
          openDropdownToggle={openDropdownToggle}
          open={open}
          inputValue={inputValue}
          handleInputChange={handleInputChange}
          handleRemoveAllOptions={handleRemoveAllOptions}
          clearOptions={clearOptions}
          onChange={onChange}
        />
      ) : (
        <SelectFieldSingleComponent<T>
          value={value}
          handleChange={handleChange}
          multiple={multiple}
          findLabel={findLabel}
          findValue={findValue}
          search={search}
          openDropdownToggle={openDropdownToggle}
          open={open}
          inputValue={inputValue}
          handleInputChange={handleInputChange}
          handleRemoveAllOptions={handleRemoveAllOptions}
          clearOptions={clearOptions}
          onChange={onChange}
        />
      )}

      {open && (
        <div
          className={
            "absolute top-full mt-3 w-full flex flex-col gap-y-3 border p-2 rounded-lg"
          }
        >
          {filterOptions.length ? (
            filterOptions.map((option) => {
              const handleSelectChange = () => {
                handleChange(option);
                if (!multiple) {
                  openDropdownToggle();
                }
              };

              return (
                <OptionComponent<T>
                  key={findValue(option)}
                  findLabel={findLabel}
                  onClick={handleSelectChange}
                  item={option}
                  multiple={multiple}
                  active={activeOption(option)}
                />
              );
            })
          ) : (
            <p>Ничего не найдено</p>
          )}
        </div>
      )}
    </div>
  );
};
