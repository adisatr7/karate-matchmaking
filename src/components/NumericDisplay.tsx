import { useEffect, useState } from "react"


type PropsType = {
  label: string,
  value?: number | string,
}

export default function NumericDispalay({ label, value }: PropsType) {
  const [text, setText] = useState<string>("")
  const [number, setNumber] = useState<number | string>(0)

  useEffect(() => {
    if (value)
      setNumber(value)
  }, [value])

  useEffect(() => {
    setText(label)
  }, [label])

  return (
    <div className="flex flex-col my-[2px]">
      <p className="font-bold text-white font-quicksand text-body">{number}</p>
      <p className="text-white opacity-60 font-quicksand text-caption">{text}</p>
    </div>
  )
}