import { ReactNode, useEffect, useState } from "react"
import { Tournament } from "../types"
import { getAllTournaments, getTotalParticipants } from "../data/controllers/tournaments"
import useNotification from "../hooks/useNotification"
import { toSentenceCase } from "../utils/stringFunctions"


export default function TournamentTable() {
  const [selectedRow, setSelectedRow] = useState(-1)
  const [tournamentsList, setTournamentsList] = useState<Tournament[]>([])

  const headerLabels: string[] = [
    "NO", 
    "NAMA PERTANDINGAN", 
    "STATUS", 
    // "JADWAL", 
    "PENYELENGGARA", 
    "PESERTA"
  ]

  const handleRowClick = (idPertandingan: string) => {
    
  } 

  const fetchTournaments = async () => {
    const tournaments = await getAllTournaments()
    setTournamentsList(tournaments)
    // useNotification("Debug", JSON.stringify(tournaments))
  }

  const fetchJmlPeserta = (tournament: Tournament) => {
    let totalParticipants = 0

    tournament.kelas.forEach(kelas => {
      totalParticipants += kelas.daftarTim.length
    })
    return totalParticipants
  }

  useEffect(() => {
    fetchTournaments()
  }, [])

  return (
    <table className="table-auto w-full h-fit bg-dark-glass border border-separate border-stone-600 rounded-md bg-opacity-50 backdrop-blur-md text-white font-quicksand">
      {/* Header */}
      <thead className="sticky top-0 rounded-t-lg bg-dark-glass hover:bg-stone-700 border border-separate border-stone-600 rounded-md">
        <tr className="">
          { headerLabels.map((value: string, index: number) => {
            return ( <td key={index} className={headerRowStyle}>{value}</td> )
          })}
        </tr>
      </thead>
      <tbody>
        { 
          tournamentsList.map((tournament: Tournament, tournamentIndex: number) => {
            const { idPertandingan, namaPertandingan, status, penyelenggara } = tournament
            const jmlPeserta = fetchJmlPeserta(tournament)

            return (
              <tr
                key={tournamentIndex}
                onClick={() => handleRowClick(idPertandingan)}
                className={`bg-opacity-40 hover:bg-primary-gradient rounded-full hover:cursor-pointer ${tournamentIndex % 2 === 0 ? "bg-stone-900" : "bg-stone-800"}`}>

                {/* Render table cells based on the header labels */}
                { 
                  headerLabels.map((label: string, rowIndex: number) => (
                    <td key={rowIndex} className={`px-[10px] py-[4px]`}>
                      {/* Render idPertandingan column conditionally */}
                      { label === "NO" ? tournamentIndex + 1 
                        : label === "NAMA PERTANDINGAN" ? toSentenceCase(namaPertandingan)
                        : label === "STATUS" ? toSentenceCase(status)
                        : label === "PENYELENGGARA" ? toSentenceCase(penyelenggara) 
                        : jmlPeserta }
                    </td>
                  ))
                }
              </tr>
            )
          })
        }
      </tbody>
    </table>
  )
}

const headerRowStyle = "px-[10px] py-[4px] font-bold text-left"