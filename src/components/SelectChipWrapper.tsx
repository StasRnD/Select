import React, { PropsWithChildren } from "react";
import { twMerge } from "tailwind-merge";

interface SelectChipWrapperProps {
  noWrap?: boolean;
  viewCountChildren?: number;
}

export const SelectChipWrapper: React.FC<
  PropsWithChildren<SelectChipWrapperProps>
> = (props) => {
  const { children, viewCountChildren = 0, noWrap } = props;
  const allChildren = React.Children.toArray(children);
  const childrenCount = allChildren.length;

  return (
    <div
      className={twMerge(
        "px-1.5 py-1 flex flex-wrap gap-1 grow",
        noWrap && "flex-nowrap overflow-hidden",
      )}
    >
      {viewCountChildren ? (
        <>
          {allChildren.slice(0, viewCountChildren)}
          {childrenCount > viewCountChildren && (
            <div>
              ...<span>{childrenCount}</span>
            </div>
          )}
        </>
      ) : (
        children
      )}
    </div>
  );
};
