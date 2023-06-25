import { HTMLAttributes, HTMLInputTypeAttribute, useState } from "react"
import { SVGIcon } from "../types"


type PropsType = {
  leftIcon?: SVGIcon,
  rightIcon?: SVGIcon,
  label: string,
  onChange: (value: string) => void,
  value?: string,
  className?: string,
  type?: HTMLInputTypeAttribute,
  inputMode?: HTMLAttributes<HTMLInputElement>["inputMode"],
}

export default function Entry ({ leftIcon: LeftIcon, rightIcon: RightIcon, label, onChange, value, className="", type="text", inputMode="text" }: PropsType) {
  const [isFocused, setIsFocused] = useState(false)

  return (
    <div className={`flex flex-row bg-gray-100 gap-[12px] rounded-md font-quicksand text-caption  border-2 ${isFocused && "border-red-500"} ${className}`}>
      {LeftIcon && <LeftIcon className="w-6 h-6 fill-stone-500 opacity-50"/>}
      <input 
        type={type}
        inputMode={inputMode}
        value={value} 
        placeholder={label} 
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className="bg-transparent w-full h-[34px] rounded-md px-2 py-1 focus:outline-none"/>
      {RightIcon && <RightIcon className="w-6 h-6 fill-stone-500 opacity-50"/>}
    </div>
  )
}