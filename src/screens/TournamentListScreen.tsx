import { useState } from "react"
import MenuBackground from "../components/MenuBackground"
import Entry from "../components/Entry"
import Button from "../components/Button"
import { Search as SearchIcon } from "../assets/icons"
import TournamentTable from "../components/Table"


export default function TournamentListScreen() {
  const [searchKeyword, setSearchKeyword] = useState("")

  return (
    <MenuBackground pageName="Daftar Pertandingan">

      {/* Search bar and its buttons */}
      <div className="flex flex-row h-fit w-full gap-[10px]">
        <Entry 
          label="Cari nama pertandingan" 
          inputMode="text" 
          onChange={setSearchKeyword}
          leftIcon={SearchIcon}
          value={searchKeyword}
          className="flex-[2]"/>
        <Button 
          label="CARI PERTANDINGAN"
          className="flex-[1]"/>
        <Button 
          label="PERTANDINGAN BARU"
          className="flex-[1]"/>
        <Button 
          label="?"
          className="w-fit px-[18px]"/>
      </div>

      {/* Table */}
      <div className="flex flex-col w-full max-h-full overflow-y-scroll">
        <TournamentTable/>
      </div>

    </MenuBackground>
  )
}