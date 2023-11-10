export interface SelectOptionProps<T> {
  multiple?: boolean;
  item: T;
  findLabel: (option: T) => string;
  active?: boolean;
  onClick: VoidFunction;
}
