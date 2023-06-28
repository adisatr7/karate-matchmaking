import { useAppSelector } from "../store"


export default function ProfileButton() {
  const currentUser = useAppSelector(state => state.auth.currentUser)

  return (
    <button className="flex flex-row gap-[12px] hover:bg-stone-300 hover:bg-opacity-20 rounded-md py-[6px] px-[14px] items-center h-fit w-fit">
      <h1 className="font-quicksand text-white text-body">{currentUser?.userName}</h1>
      <img
        src={currentUser?.imageUrl}
        className="rounded-full bg-cover bg-gray-500 w-[30px] h-[30px] outline-0"/>
    </button>
  )
}