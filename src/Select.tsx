import React, {
  useEffect,
  useState,
  useMemo,
  useRef,
  useCallback,
} from "react";
import { useOutsideClick } from "./hooks";
import { SelectOption } from "./components/SelectOption";
import { SelectChipWrapper } from "./components/SelectChipWrapper";
import { SelectChip } from "./components/SelectChip";
import { SelectOptionProps } from "./model";

type SelectProps<T> = {
  options: T[];
  search?: boolean;
  getLabel?: (value: T | null) => string;
  getValue?: (value: T | null) => string | number;
  customOption?: React.FC<SelectOptionProps<T>>;
  clearOptions?: boolean;
} & (
  | {
      multiple: true;
      value: T[];
      onChange: (value: T[]) => void;
    }
  | {
      multiple: false;
      value: T | null;
      onChange: (value: T | null) => void;
    }
);

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

  function checkLabel<T>(option: T | null): string {
    if (option === null) {
      return "";
    }
    if (typeof option === "object" && "label" in option) {
      return String(option.label);
    }

    throw Error("нет Option");
  }

  function checkValue<T>(option: T | null): number | string {
    if (option === null) {
      return "";
    }
    if (typeof option === "object" && "value" in option) {
      return Number(option.value) || String(option.value);
    }

    throw Error("нет Option");
  }

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
  return (
    <div ref={ref} className={"flex flex-col gap-x-y relative"}>
      <div
        onClick={openDropdownToggle}
        className={`flex gap-y-2 border rounded-lg hover:border-blue-600 cursor-pointer ${
          open && "outline outline-2 outline-blue-400"
        }`}
      >
        {!multiple &&
          (search ? (
            <input
              defaultChecked={false}
              onClick={(evt: React.MouseEvent<HTMLInputElement>) =>
                open && evt.stopPropagation()
              }
              className={"focus:outline-0 grow p-2 rounded-lg"}
              value={inputValue}
              onChange={handleInputChange}
              placeholder={"Поиск..."}
            />
          ) : (
            <span className={"p-2 rounded-lg grow"}>
              {findLabel(value) || "Выбирай"}
            </span>
          ))}
        {multiple && (
          <SelectChipWrapper viewCountChildren={2}>
            {value.length ? (
              value.map((el) => {
                return (
                  <SelectChip
                    key={findValue(el)}
                    label={findLabel(el)}
                    onClickRemove={(evt: React.MouseEvent<SVGElement>) => {
                      evt.stopPropagation();
                      handleChange(el);
                    }}
                  />
                );
              })
            ) : (
              <span className={"p-2 rounded-lg"}>Выбирай</span>
            )}
          </SelectChipWrapper>
        )}

        {(multiple ? !!value.length : value) && clearOptions && (
          <button
            className={
              "ml-auto bg-transparent border-l-2 px-4 hover:bg-blue-400 hover:text-white"
            }
            onClick={(evt: React.MouseEvent<HTMLButtonElement>) => {
              evt.stopPropagation();
              handleRemoveAllOptions();
            }}
          >
            Вытереть значение
          </button>
        )}

        <button
          className={
            "ml-auto bg-transparent border-l-2 px-4 rounded-r-lg hover:bg-blue-400 hover:text-white"
          }
        >
          {!open ? "открыть dropdown" : "закрыть dropdown"}
        </button>
      </div>

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
