type PropsType = {
  placeholder: string,
  options: string[],
  onChange: (value: string) => void,
  value?: string,
  className?: string,
}

export default function Dropdown ({ placeholder: label, options, onChange, value, className="" }: PropsType) {

  const handleChange = (selected: string) => {
    onChange(selected)
  }

  return (
    <select 
      onChange={(e) => handleChange(e.target.value)}
      value={value}
      className={`flex flex-row bg-gray-100 px-[10px] rounded-md items-center font-quicksand text-caption border-2 focus:border-red-500 focus:outline-none ${className}`}>
      <option>{label}</option>
      {
        options.map((optionLabel) => (
          <option value={optionLabel}>{optionLabel}</option>
        ))
      }
    </select>
  )
}