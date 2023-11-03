import React, {useEffect} from "react";

export function useOutsideClick<T extends HTMLElement>(ref: React.RefObject<T>, toggleDropdownOpen: (value: boolean) => void){
    function handleOutsideClick(event: MouseEvent) {
        if (ref.current && !ref.current.contains(event.target as Node)) {
            toggleDropdownOpen(false)
        }
    }

    useEffect(() => {
        document.addEventListener('click', handleOutsideClick);
        return () => {
            document.removeEventListener("click", handleOutsideClick);
        };
    }, []);
}