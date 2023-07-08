import Input from "./Input"


type PropsType = {
  label: string,
  onChange: (value: string) => void,
  value: string,
  type?: "text" | "number" | "password"
}

export default function FormInput({ label, onChange, value, type }: PropsType) {
  return (
    <div className="flex flex-col gap-[8px] w-full h-fit px-[10px]">
      <p className="text-white font-quicksand text-body">{label}</p>
      <Input label="" onChange={onChange} value={value} type={type || "text"}/>
    </div>
  )
}