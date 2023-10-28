import React, {PropsWithChildren} from 'react'


export const SelectDropdown: React.FC<PropsWithChildren> = (props) => {
    const {children} = props;

    return <div
        className={' rounded-lg p-2 flex flex-col gap-y-1.5 absolute top-full mt-3 w-full  bg-amber-500'}>{children}</div>
}