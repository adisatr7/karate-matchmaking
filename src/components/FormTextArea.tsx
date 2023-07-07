import TextArea from "./TextArea"


type PropsType = {
  label: string,
  onChange: (value: string) => void,
  value: string,
  type?: "text" | "number" | "password"
}

export default function FormTextArea({ label, onChange, value }: PropsType) {
  return (
    <div className="flex flex-col gap-[8px] w-full h-fit px-[10px]">
      <p className="text-white font-quicksand text-body">{label}</p>
      <TextArea label="" onChange={onChange} value={value}/>
    </div>
  )
}