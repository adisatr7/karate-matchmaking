import MenuBackground from "../components/MenuBackground"
import Button from "../components/Button"
import Header from "../components/Header"


export default function HighlightScreen() {

  const handleBroadcast = () => {
    // TODO: Implement: Open a new window in a new screen
  }

  return (
    <MenuBackground pageName="Highlight">

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

    </MenuBackground>
  )
}