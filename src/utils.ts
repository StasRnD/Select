export function checkLabel<T>(option: T | null): string {
  if (option === null) {
    return "";
  }
  if (typeof option === "object" && "label" in option) {
    return String(option.label);
  }

  throw Error("нет Option");
}

export function checkValue<T>(option: T | null): number | string {
  if (option === null) {
    return "";
  }
  if (typeof option === "object" && "value" in option) {
    return Number(option.value) || String(option.value);
  }

  throw Error("нет Option");
}

interface combine<T> {
  options: T[];
  allActiveOptions: (string | number)[] | null;
  findValue: (value: T | null) => string | number;
}

// Ф-я вернёт {} с двумя свойствами. inActiveOptions и activeOptions.
// Данные нужны для отображения options а мультиселектах (группировка, удаление)
export function combinedOptions<T extends unknown>({
  options,
  allActiveOptions,
  findValue,
}: combine<T>) {
  return options.reduce(
    (result: { inActiveOptions: T[]; activeOptions: T[] }, el) => {
      if (allActiveOptions?.includes(findValue(el))) {
        result.activeOptions.push(el);
      } else {
        result.inActiveOptions.push(el);
      }
      return result;
    },
    { inActiveOptions: [], activeOptions: [] },
  );
}
