import { Back } from "../assets/icons"


export default function BackButton() {
  return (
    <Back 
      onClick={() => window.history.back()}
      className="flex items-center justify-center text-gray-400 bg-cover hover:text-white hover:cursor-pointer"/>
  )
}