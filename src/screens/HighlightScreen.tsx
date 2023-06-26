import { useAppSelector } from "../store"
import MenuBackground from "../components/MenuBackground"


export default function HighlightScreen() {
  const currentUser = useAppSelector(state => state.auth.currentUser)

  return (
    <MenuBackground>
      
      {/* Header */}
      <div className="flex flex-row h-fit w-full justify-between items-end">
        <h1 className="font-quicksand text-white text-heading">Highlight</h1>
        <button className="flex flex-row gap-[12px] items-center h-fit w-fit">
          <h1 className="font-quicksand text-white hover:text-red-600 text-subheading">{currentUser?.name}</h1>
          <img className="rounded-full bg-cover bg-gray-500 w-[28px] h-[28px] outline-0"/>
        </button>
      </div>

      {/* Content - scrollable */}
      <div className="flex flex-col overflow-y-scroll">

      </div>

    </MenuBackground>
  )
}