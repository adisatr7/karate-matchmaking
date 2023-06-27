import { useAppSelector } from "../store"


export default function ProfileButton() {
  const currentUser = useAppSelector(state => state.auth.currentUser)

  return (
    <button className="flex flex-row gap-[12px] items-center h-fit w-fit">
      <h1 className="font-quicksand text-white hover:text-red-600 text-subheading">{currentUser?.name}</h1>
      <img
        src={currentUser?.imageUrl}
        className="rounded-full bg-cover bg-gray-500 w-[28px] h-[28px] outline-0"/>
    </button>
  )
}