import React, { useEffect } from "react";

export function useOutsideClick<T extends HTMLElement>(
  ref: React.RefObject<T>,
  handleClick: () => void,
) {
  function handleOutsideClick(event: MouseEvent) {
    if (ref.current && !ref.current.contains(event.target as Node)) {
      handleClick();
    }
  }

  useEffect(() => {
    document.addEventListener("click", handleOutsideClick);
    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  }, [handleOutsideClick]);
}
