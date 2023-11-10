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
