import { useState } from "react"
import Button from "./Button"
import Input from "./Input"


type PropsType = {
  label?: string
  value: number
  setValue: (value: number) => void
  stepValue?: number
}

export default function Spinner({ label="", value, setValue, stepValue=1 }: PropsType) {

  /**
   * State  to contain the current value of the spinner.
   */
  const [currentValue, setCurrentValue] = useState<string>(value ? value.toString() : "0")

  /**
   * Handles the decrement button click.
   */
  const handleDecrement = () => {

    // Update the props value
    const newValue: number = parseInt(currentValue) - stepValue
    setValue(newValue)

    // Update the state value
    setCurrentValue(newValue.toString())
  }

  /**
   * Handles the increment button click.
   */
  const handleIncrement = () => {

    // Update the props value
    const newValue: number = parseInt(currentValue) + stepValue
    setValue(newValue)

    // Update the state value
    setCurrentValue(newValue.toString())
  }

  /**
   * Handles the direct input of the spinner.
   * 
   * @param value The string value to be set.
   */
  const handleDirectInput = (value: string) => {

    // Check if the value is a number
    if (isNaN(parseInt(value)))
      return

    // Update the props value
    const newValue: number = parseInt(value)
    setValue(newValue)

    // Update the state value
    setCurrentValue(newValue.toString())
  }

  return (
    <div>

      { label && <p className="text-body mt-[12px] mb-[4px]">{label}</p> }

      <div className="flex flex-row gap-[12px]">

        {/* [-] Button */}
        <Button
          label="-"
          onClick={handleDecrement}
          className="w-[48px]"/>

        {/* Input box */}
        <Input
          label=""
          value={currentValue}
          onChange={handleDirectInput}
          className="w-[64px] text-center"/>

        {/* [+] Button */}
        <Button
          label="+"
          onClick={handleIncrement}
          className="w-[48px]"/>

      </div>
    </div>
  )
}