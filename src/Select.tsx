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

type SelectProps<T> = {
  options: T[];
  search?: boolean;
  getLabel?: (value: T | null) => string;
  getValue?: (value: T | null) => string | number;
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
  const { options, search, getLabel, getValue } = props;
  const ref = useRef<HTMLDivElement>(null);
  const openDropdownToggle = () => setOpen(!open);
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
    !props.multiple ? findLabel(props.value) : "",
  );
  const handleInputChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
    if (evt.target.value === "" && !props.multiple) {
      props.onChange(null);
    }
    setInputValue(evt.target.value);
  };

  function checkLabel<T>(option: T): string {
    if (option === null) {
      return "";
    }
    if (typeof option === "object" && "label" in option) {
      return String(option.label);
    }

    throw Error("нет Option");
  }

  function checkValue<T>(option: T): number | string {
    if (option === null) {
      return "";
    }
    if (typeof option === "object" && "value" in option) {
      return Number(option.value) || String(option.value);
    }

    throw Error("нет Option");
  }

  const filterOptions = useMemo(() => {
    return !search ||
      findLabel(!props.multiple ? props.value : null) === inputValue
      ? options
      : options.filter((option) => {
          return toLowerCaseAndTrim(findLabel(option)).includes(
            toLowerCaseAndTrim(inputValue),
          );
        });
  }, [search, findLabel, props.multiple, props.value, inputValue, options]);

  //Массив строк - лейблы выбранных options
  const allActiveOption = useMemo(() => {
    return props.multiple
      ? props.value.reduce(
          (acc: Array<string | number>, value: T) => {
            return [...acc, findValue(value)];
          },
          [] as Array<string | number>,
        )
      : null;
  }, [findValue, props.multiple, props.value]);

  //Ф-я возвращает true, если label переданного option есть в выбранных options (переменная allActiveOption)
  const activeOption = (option: T): boolean => {
    return props.multiple
      ? (allActiveOption as Array<string | number>).includes(findValue(option))
      : Boolean(findValue(option));
  };

  //обработчик onChange в зависимости от того типа селекта(мульти или нет)
  //Принимает option. Если мультиселект, то проверяем выбранный option или нет
  // Если выбран, то отфильтровываем value(удаляем данный option из выбранных), если не выбран, то добавляем в value(выбранные option)
  const handleChange = (option: T) => {
    if (props.multiple) {
      if (activeOption(option)) {
        props.onChange(
          props.value.filter((el) => findLabel(el) !== findLabel(option)),
        );
      } else {
        props.onChange([...props.value, option]);
      }
    } else {
      props.onChange(option);
    }
  };

  //Вытереть все опции
  const handleRemoveAllOptions = () => {
    if (props.multiple) {
      props.onChange([]);
    } else {
      props.onChange(null);
    }
  };

  useEffect(() => {
    !props.multiple && setInputValue(findLabel(props.value));
  }, [search, props.value, props.multiple, findLabel]);

  useOutsideClick(ref, () => setOpen(false));

  return (
    <div ref={ref} className={"flex flex-col gap-x-y relative"}>
      <div
        onClick={openDropdownToggle}
        className={`flex gap-y-2 border rounded-lg hover:border-blue-600 cursor-pointer ${
          open && "outline outline-2 outline-blue-400"
        }`}
      >
        {!props.multiple &&
          (search ? (
            <input
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
              {findLabel(props.value) || "Выбирай"}
            </span>
          ))}
        {props.multiple && (
          <SelectChipWrapper viewCountChildren={2}>
            {props.value.length ? (
              props.value.map((el) => {
                return (
                  <SelectChip
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

        {(props.multiple ? !!props.value.length : props.value) && (
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
                !props.multiple && openDropdownToggle();
              };
              return (
                <SelectOption
                  onClick={handleSelectChange}
                  label={findLabel(option)}
                  multiple={props.multiple}
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
