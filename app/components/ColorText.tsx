'use client'

import { useContext } from "react";
import { ColorContext } from "../page";

export default function ColorText({children}: {children: string}) {
    const color = useContext(ColorContext) || "rgb(243, 90, 92)"
    return (
        <span style={{color}}>
        {" "}{children}
        </span>
    )
}