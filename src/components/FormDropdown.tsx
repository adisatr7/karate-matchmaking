import Dropdown from "./Dropdown"

/**
 * Prop types for Input component
 */
type InputProps = {
  label: string,
  placeholder: string,
  options: string[],
  onChange: (value: string) => void,
  value: string
}

/**
 * Input component
 */
export default function FormDropdown({ label, placeholder, options, onChange, value }: InputProps) {
  return (
    <div className="flex flex-col gap-[8px] w-full h-fit px-[10px]">
      <p className="font-quicksand text-body text-white">{label}</p>
      <Dropdown 
        label={placeholder} 
        options={options}
        onChange={onChange}
        value={value}/>
    </div>
  )
}