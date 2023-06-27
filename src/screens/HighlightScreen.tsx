import MenuBackground from "../components/MenuBackground"
import Button from "../components/Button"
import ProfileButton from "../components/ProfileButton"


export default function HighlightScreen() {

  const handleBroadcast = () => {
    // TODO: Implement: Open a new window in a new screen
  }

  return (
    <MenuBackground>
      
      {/* Header */}
      <div className="flex flex-row h-fit w-full justify-between items-end">
        <h1 className="font-quicksand text-white text-heading">Highlight</h1>
        <ProfileButton/>
      </div>

      {/* Content - scrollable */}
      <div className="flex flex-col gap-[14px] overflow-y-scroll">

        {/* Bracket */}
        <div className="flex flex-col justify-center items-center h-[500px] w-full bg-dark-glass bg-opacity-80 backdrop-blur-sm rounded-md gap-[12px] mt-[24px]">
          <p className="font-quicksilver text-body text-white">Bracket placeholder</p>
        </div>

        {/* Buttons container */}
        <div className="flex flex-row h-fit w-full gap-[12px]">
          <Button label="BROADCAST" className="w-full" onClick={handleBroadcast}/>
          <Button label="DETAIL PERTANDINGAN" className="w-full" onClick={handleBroadcast}/>
          <Button label="DAFTAR TIM" className="w-full" onClick={handleBroadcast}/>
          <Button label="DAFTAR PESERTA" className="w-full" onClick={handleBroadcast}/>
        </div>
      </div>

    </MenuBackground>
  )
}