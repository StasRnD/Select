import React, {useContext} from 'react'
import {Context} from "../Context";


export const Chevron: React.FC = () => {

    const {isOpenDropdown} = useContext(Context)

    return <svg className={`${isOpenDropdown && 'rotate-180'}`} width="20px" height="20px" viewBox="0 0 24 24"
                fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M6 15L12 9L18 15" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>

}