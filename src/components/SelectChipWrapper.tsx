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

    viewCountChildren,
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
        children || viewCountChildren ? (
          <React.Fragment>
            {allChildren.slice(0, viewCountChildren)}
            {childrenCount > Number(viewCountChildren) && (
              <React.Fragment>
                <span>...</span>
                <span className={"ml-auto"}>{childrenCount}</span>
              </React.Fragment>
            )}
          </React.Fragment>
        ) : (
          <span>Выбирай</span>
        )
      ) : (
        <React.Fragment>
          {children}
          <SelectSearchInput {...rest} />
        </React.Fragment>
      )}
    </div>
  );
};
