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
  OptionSelectAll,
  SelectFieldMultipleProps,
  SelectFieldSingleProps,
  SelectOptionProps,
} from "./model";
import { checkValue, checkLabel, combinedOptions } from "./utils";
import { SingleSelect, MultiSelect } from "./model";
import { SelectFieldMultiple } from "./components/SelectFieldMultiple";
import { SelectFieldSingle } from "./components/SelectFieldSingle";

type GroupOptions<T> = {
  groupName: string;
  groupOptions: T[];
};

type ComponentsProps<T> = {
  SelectSingleField?: React.FC<SelectFieldSingleProps<T>>;
  SelectMultiField?: React.FC<SelectFieldMultipleProps<T>>;
  Option?: React.FC<SelectOptionProps<T>>;
  OptionRightSlot?: React.FC<{
    item: T;
    active: boolean | undefined;
  }>;
  OptionLeftSlot?: React.FC<{
    item: T;
    active: boolean | undefined;
  }>;
};

type SelectProps<T> = {
  search?: boolean;
  getLabel?: (value: T | null) => string;
  getValue?: (value: T | null) => string | number;
  Components?: ComponentsProps<T>;
  clearOptions?: boolean;
  optionWithCheckbox?: boolean;
  hasGroupOptions?: boolean;
  hasDeletableOptions?: boolean;
  showOptionChoseAll?: boolean;

  viewCountChildren?: number;
} & (SingleSelect<T> | MultiSelect<T>) &
  (
    | { options: T[]; grouped: false }
    | { options: GroupOptions<T>[]; grouped: true }
  );

const toLowerCaseAndTrim = (value: string): string => {
  return value.toLowerCase().trim();
};
export const Select = <V, T = V extends V[] ? V[number] : V>(
  props: SelectProps<T>,
) => {
  const {
    hasGroupOptions,
    hasDeletableOptions,
    options,
    Components,
    multiple,
    value,
    onChange,
    search,
    getLabel,
    getValue,
    clearOptions,
    optionWithCheckbox,
    viewCountChildren,
    showOptionChoseAll,
    grouped,
  } = props;

  const ref = useRef<HTMLDivElement>(null);
  const openDropdownToggle = () => setOpen((open) => !open);
  const [open, setOpen] = useState<boolean>(false);

  const allOptions = useMemo(
    () =>
      grouped ? options.flatMap(({ groupOptions }) => groupOptions) : options,
    [grouped, options],
  );

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

  const findActiveAndInactiveOptions = (options: T[]) =>
    combinedOptions({
      options,
      findValue,
      allActiveOptions,
    });

  const createViewOptions = (
    activeAndInactiveOptions: { activeOptions: T[]; inActiveOptions: T[] },
    options: T[],
  ) => {
    if (multiple && hasGroupOptions) {
      return [
        ...activeAndInactiveOptions.activeOptions,
        ...activeAndInactiveOptions.inActiveOptions,
      ];
    }

    if (multiple && hasDeletableOptions) {
      return [...activeAndInactiveOptions.inActiveOptions];
    }
    return options;
  };

  const makeFilterOptions = (viewOptions: T[]) => {
    if (!search || (!multiple && findLabel(value) === inputValue)) {
      return viewOptions;
    }

    return viewOptions.filter((option) => {
      return toLowerCaseAndTrim(findLabel(option)).includes(
        toLowerCaseAndTrim(inputValue),
      );
    });
  };
  const renderSimpleOptions = (options: T[]) => {
    const activeAndUnActiveOptions = findActiveAndInactiveOptions(options);
    const viewSimpleOptions = createViewOptions(
      activeAndUnActiveOptions,
      options,
    );
    const filterSimpleOptions = makeFilterOptions(viewSimpleOptions);
    return filterSimpleOptions.map((option) => {
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
          LeftSlot={Components?.OptionLeftSlot}
          RightSlot={Components?.OptionRightSlot}
          withCheckbox={optionWithCheckbox}
        />
      );
    });
  };

  const renderOptions = () => {
    return grouped
      ? options.map(({ groupName, groupOptions }) => {
          const activeAndInactiveGroupOptions =
            findActiveAndInactiveOptions(groupOptions);

          const viewGroupOptions = createViewOptions(
            activeAndInactiveGroupOptions,
            groupOptions,
          );

          const filterGroupOptions = makeFilterOptions(viewGroupOptions);

          return (
            <React.Fragment key={groupName}>
              {!!filterGroupOptions.length ? (
                <span>{groupName}</span>
              ) : (
                <span>в группе {groupName} ничего не найдено</span>
              )}

              {filterGroupOptions.map((option: T) => {
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
                    LeftSlot={Components?.OptionLeftSlot}
                    RightSlot={Components?.OptionRightSlot}
                    withCheckbox={optionWithCheckbox}
                  />
                );
              })}
            </React.Fragment>
          );
        })
      : renderSimpleOptions(options);
  };

  const [inputValue, setInputValue] = useState<string>(
    !multiple ? findLabel(value) : "",
  );
  const handleInputChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
    if (evt.target.value === "" && !multiple) {
      onChange(null);
    }
    setInputValue(evt.target.value);
  };

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

  const handleClickSelectAll = () => {
    if (multiple) {
      if (value.length === allOptions.length) {
        onChange([]);
      } else {
        onChange(allOptions);
      }
    }
  };

  const OptionComponent = Components?.Option ?? SelectOption;

  const SelectFieldSingleComponent =
    Components?.SelectSingleField ?? SelectFieldSingle;
  const SelectFieldMultiComponent =
    Components?.SelectMultiField ?? SelectFieldMultiple;

  useEffect(() => {
    if (!multiple) {
      setInputValue(findLabel(value));
    }
  }, [search, value, multiple, findLabel]);

  useOutsideClick(ref, () => setOpen(false));

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
          viewCountChildren={viewCountChildren}
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
          {multiple && showOptionChoseAll && (
            <SelectOption<OptionSelectAll>
              item={{ label: "Все", value: "all" }}
              findLabel={() => "Все"}
              onClick={handleClickSelectAll}
              withCheckbox
              active={value.length === allOptions.length}
              multiple
            />
          )}
          {renderOptions()}
        </div>
      )}
    </div>
  );
};
