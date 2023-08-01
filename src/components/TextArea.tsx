import { HTMLAttributes, useState } from "react"


type PropsType = {
  label: string,
  onChange: (value: string) => void,
  value?: string,
  className?: string,
  inputMode?: HTMLAttributes<HTMLInputElement>["inputMode"],
}

export default function Input ({ label, onChange, value, className="", inputMode="text" }: PropsType) {
  const [isFocused, setIsFocused] = useState(false)

  return (
    <div className={`flex flex-row bg-gray-100 px-[10px] rounded-md items-center font-quicksand text-caption border-2 ${isFocused && "border-red-500"} ${className}`}>
      <textarea
        inputMode={inputMode}
        value={value} 
        placeholder={label} 
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className="w-full h-[180px] px-2 py-1 text-black bg-transparent rounded-md focus:outline-none"/>
    </div>
  )
}