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

type SelectProps<T> = {
  options: T[] | GroupOptions<T>[];
  search?: boolean;
  getLabel?: (value: T | null) => string;
  getValue?: (value: T | null) => string | number;
  CustomOption?: React.FC<SelectOptionProps<T>>;
  CustomSelectSingleField?: React.FC<SelectFieldSingleProps<T>>;
  CustomSelectMultiField?: React.FC<SelectFieldMultipleProps<T>>;
  clearOptions?: boolean;
  optionWithCheckbox?: boolean;
  hasGroupOptions?: boolean;
  hasDeletableOptions?: boolean;
  showOptionChoseAll?: boolean;
  SelectOptionLeftSlot?: React.FC<{
    item: T;
    active: boolean | undefined;
  }>;
  SelectOptionRightSlot?: React.FC<{
    item: T;
    active: boolean | undefined;
  }>;
  viewCountChildren?: number;
} & (SingleSelect<T> | MultiSelect<T>);

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
    CustomOption,
    multiple,
    value,
    onChange,
    search,
    getLabel,
    getValue,
    clearOptions,
    CustomSelectSingleField,
    CustomSelectMultiField,
    SelectOptionLeftSlot,
    SelectOptionRightSlot,
    optionWithCheckbox,
    viewCountChildren,
    showOptionChoseAll,
  } = props;

  const ref = useRef<HTMLDivElement>(null);
  const openDropdownToggle = () => setOpen((open) => !open);
  const [open, setOpen] = useState<boolean>(false);

  // @ts-ignore
  const isGrouped = Array.isArray(options[0]["groupOptions"]);

  // @ts-ignore
  const flatMapGroupOptions = isGrouped
    ? // @ts-ignore
      options.flatMap(({ groupOptions }) => {
        return groupOptions;
      })
    : null;

  const renderGroupOptions = () => {
    // @ts-ignore
    return isGrouped
      ? // @ts-ignore
        options.map(({ groupName, groupOptions }) => {
          const activeAndInactiveOptions = combinedOptions({
            // @ts-ignore
            options: groupOptions,
            findValue,
            allActiveOptions,
          });

          const viewOptions = () => {
            if (multiple && hasGroupOptions) {
              return [
                ...activeAndInactiveOptions.activeOptions,
                ...activeAndInactiveOptions.inActiveOptions,
              ];
            }

            if (multiple && hasDeletableOptions) {
              return [...activeAndInactiveOptions.inActiveOptions];
            }

            return groupOptions;
          };

          const filterOptions = () => {
            if (!search || (!multiple && findLabel(value) === inputValue)) {
              console.log("не фильтр");
              return viewOptions();
            }
            // @ts-ignore
            return viewOptions().filter((option) => {
              return toLowerCaseAndTrim(findLabel(option)).includes(
                toLowerCaseAndTrim(inputValue),
              );
            });
          };
          return {
            groupName,
            groupOptions: filterOptions(),
          };
        })
      : null;
  };

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

  const activeAndInactiveOptions = combinedOptions({
    // @ts-ignore
    options,
    findValue,
    allActiveOptions,
  });

  const viewOptions = useMemo(() => {
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
  }, [
    activeAndInactiveOptions.activeOptions,
    activeAndInactiveOptions.inActiveOptions,
    hasDeletableOptions,
    hasGroupOptions,
    multiple,
    options,
  ]);

  // const filterOptions = useMemo(() => {
  //   if (!search || (!multiple && findLabel(value) === inputValue)) {
  //     console.log("не фильтр");
  //     return viewOptions;
  //   }
  //
  //   return viewOptions.filter((option) => {
  //     console.log("фильтр");
  //     return toLowerCaseAndTrim(findLabel(option)).includes(
  //       toLowerCaseAndTrim(inputValue),
  //     );
  //   });
  // }, [search, findLabel, multiple, value, inputValue, options]);

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
      if (
        value.length === (isGrouped ? flatMapGroupOptions : options)?.length
      ) {
        onChange([]);
      } else {
        // @ts-ignore
        onChange(isGrouped ? flatMapGroupOptions : options);
      }
    }
  };

  const OptionComponent = CustomOption ?? SelectOption;

  const SelectFieldSingleComponent =
    CustomSelectSingleField ?? SelectFieldSingle;
  const SelectFieldMultiComponent =
    CustomSelectMultiField ?? SelectFieldMultiple;

  useEffect(() => {
    if (!multiple) {
      setInputValue(findLabel(value));
    }
  }, [search, value, multiple, findLabel]);
  console.log(renderGroupOptions());
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
              // @ts-ignore
              active={
                value.length ===
                // @ts-ignore
                (isGrouped ? flatMapGroupOptions : options).length
              }
              multiple
            />
          )}
          {isGrouped &&
            renderGroupOptions()?.map(({ groupName, groupOptions }) => {
              return (
                <>
                  <span>{groupName}</span>

                  {groupOptions.map((option: T) => {
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
                        LeftSlot={SelectOptionLeftSlot}
                        RightSlot={SelectOptionRightSlot}
                        withCheckbox={optionWithCheckbox}
                      />
                    );
                  })}
                </>
              );
            })}

          {/*{filterOptions.length ? (*/}
          {/*  filterOptions.map((option) => {*/}
          {/*    const handleSelectChange = () => {*/}
          {/*      handleChange(option);*/}
          {/*      if (!multiple) {*/}
          {/*        openDropdownToggle();*/}
          {/*      }*/}
          {/*    };*/}

          {/*    return (*/}
          {/*      <OptionComponent<T>*/}
          {/*        key={findValue(option)}*/}
          {/*        findLabel={findLabel}*/}
          {/*        onClick={handleSelectChange}*/}
          {/*        item={option}*/}
          {/*        multiple={multiple}*/}
          {/*        active={activeOption(option)}*/}
          {/*        LeftSlot={SelectOptionLeftSlot}*/}
          {/*        RightSlot={SelectOptionRightSlot}*/}
          {/*        withCheckbox={optionWithCheckbox}*/}
          {/*      />*/}
          {/*    );*/}
          {/*  })*/}
          {/*) : (*/}
          {/*  <p>Ничего не найдено</p>*/}
          {/*)}*/}
        </div>
      )}
    </div>
  );
};
