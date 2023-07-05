import Entry from "./Entry"

/**
 * Prop types for Input component
 */
type InputProps = {
  label: string,
  onChange: (value: string) => void,
  value: string,
  type?: "text" | "number" | "password"
}

/**
 * Input component
 */
export default function FormInput({ label, onChange, value, type }: InputProps) {
  return (
    <div className="flex flex-col gap-[8px] w-full h-fit px-[10px]">
      <p className="font-quicksand text-body text-white">{label}</p>
      <Entry label="" onChange={onChange} value={value} type={type || "text"}/>
    </div>
  )
}