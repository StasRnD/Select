import React, { PropsWithChildren } from "react";
import { twMerge } from "tailwind-merge";
import { SelectSearchInput, SelectSearchInputProps } from "./SelectSearchInput";

interface SelectChipWrapperProps extends SelectSearchInputProps {
  noWrap?: boolean;
  viewCountChildren?: number;
  search: boolean | undefined;
}

export const SelectChipWrapper: React.FC<
  PropsWithChildren<SelectChipWrapperProps>
> = (props) => {
  const {
    children,

    viewCountChildren = 2,
    search,
    noWrap,
    ...rest
  } = props;
  const allChildren = React.Children.toArray(children);
  const childrenCount = allChildren.length;

  return (
    <div
      className={twMerge(
        "px-1.5 py-1 flex flex-wrap gap-1 grow",
        noWrap && "flex-nowrap overflow-hidden",
      )}
    >
      {!search ? (
        children ? (
          <>
            {allChildren.slice(0, viewCountChildren)}
            {childrenCount > viewCountChildren && (
              <>
                <span>...</span>
                <span className={"ml-auto"}>{childrenCount}</span>
              </>
            )}
          </>
        ) : (
          <span>Выбирай</span>
        )
      ) : (
        <>
          {children}
          <SelectSearchInput {...rest} />
        </>
      )}
    </div>
  );
};
