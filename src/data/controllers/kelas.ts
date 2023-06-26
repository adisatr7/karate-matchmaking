import { KelasPertandingan } from "../../types"
import { getAllTournaments, getTournamentById, saveTournamentsData } from "./tournaments"
import useNotification from "../../hooks/useNotification"
import { getTeamById } from "./teams"
import { getAthleteById } from "./athletes"


/**
 * Get all kelas from a tournament
 * 
 * @param tournamentId Tournament ID to get all kelas from
 * @returns List of all kelas from the tournament
 */
export const getAllKelas = (tournamentId: string): KelasPertandingan[] => {
  let tournament = getTournamentById(tournamentId)
  let kelas: KelasPertandingan[] = []

  if (tournament) {
    kelas = tournament.kelas

    return kelas
  }

  else {
    useNotification("Terjadi kesalahan saat membaca data kelas", "Tidak dapat menemukan data pertandingan!")

    return []
  }
}


/**
 * Get a kelas from a tournament by its ID
 * 
 * @param tournamentId Tournament ID to get the kelas from 
 * @param idKelas ID of the kelas to get
 * 
 * @returns The kelas object
 */
export const getKelasById = (tournamentId: string, idKelas: string): KelasPertandingan | undefined => {
  let kelas = getAllKelas(tournamentId).find(kelas => kelas.idKelas === idKelas)

  // Check if kelas is found
  if (kelas)
    return kelas

  else {
    useNotification("Terjadi kesalahan saat membaca data kelas", "Tidak dapat menemukan data kelas!")

    return undefined
  }
}


/**
 * Add a new kelas to a tournament
 * 
 * @param tournamentId Tournament ID to add the kelas to
 * @param newKelas The new kelas object
 */
export const addKelas = (tournamentId: string, newKelas: KelasPertandingan) => {
  let tournament = getTournamentById(tournamentId)
  let kelas = getAllKelas(tournamentId)

  if (tournament) {
    kelas.push(newKelas)
    tournament.kelas = kelas

    saveTournamentsData(tournament)
  }

  else {
    useNotification("Terjadi kesalahan saat menambahkan data kelas", "Tidak dapat menemukan data pertandingan!")
  }
}


/**
 * Delete a kelas from a tournament
 * 
 * @param tournamentId Tournament ID to delete the kelas from
 * @param updatedKelas The updated kelas object
 */
export const updateKelas = (tournamentId: string, updatedKelas: KelasPertandingan) => {
  let tournament = getTournamentById(tournamentId)
  let kelas = getAllKelas(tournamentId)

  if (tournament) {
    kelas = kelas.map(kelas => kelas.idKelas === updatedKelas.idKelas ? updatedKelas : kelas)
    tournament.kelas = kelas

    saveTournamentsData(tournament)
  }

  else {
    useNotification("Terjadi kesalahan saat mengubah data kelas", "Tidak dapat menemukan data pertandingan!")
  }
}


/**
 * Delete a kelas from a tournament
 * 
 * @param tournamentId Tournament ID to delete the kelas from
 * @param idKelas ID of the kelas to delete
 */
export const deleteKelas = (tournamentId: string, idKelas: string) => {
  const tournaments = getAllTournaments()

  // Get the target tournament and kelas object
  let tournament = tournaments.find(tournament => tournament.idPertandingan === tournamentId)
  let kelas = getAllKelas(tournamentId)

  // Remove the kelas from the specified tournament
  if (tournament) {
    kelas = kelas.filter(kelas => kelas.idKelas !== idKelas)
    tournament.kelas = kelas

    // Save all the changes to 'tournaments.json'
    saveTournamentsData(tournaments)
  }

  // If the tournament is not found
  else {
    useNotification("Terjadi kesalahan saat menghapus data kelas", "Tidak dapat menemukan data pertandingan!")
  }
}


/**
 * Register a team to a kelas
 * 
 * @param tournamentId Tournament ID to register the team to
 * @param idKelas ID of the kelas to register the team to
 * @param teamId ID of the team to be registered
 */
export const registerTeam = (tournamentId: string, idKelas: string, teamId: string, athleteId: string) => {
  const kelas = getKelasById(tournamentId, idKelas)
  const athlete = getAthleteById(athleteId)
  
  if (kelas && athlete) {
    kelas.daftarTim.push({
      idTim: teamId,
      namaTim: getTeamById(teamId)?.namaTim,
      idAtlet: athlete?.idAtlet,
      namaAtlet: athlete?.namaAtlet
    })

    updateKelas(tournamentId, kelas)
  }
}


/**
 * Remove a team from a kelas
 * 
 * @param tournamentId The tournament ID to unregister the team from
 * @param idKelas The kelas ID to unregister the team from
 * @param teamId The team ID to be unregistered
 */
export const unregisterTeam = (tournamentId: string, idKelas: string, teamId: string) => {
  const kelas = getKelasById(tournamentId, idKelas)
  
  // Remove the team from the kelas
  if (kelas) {
    kelas.daftarTim = kelas.daftarTim.filter(team => team.idTim !== teamId)
    
    // Update the kelas object
    updateKelas(tournamentId, kelas)

    // Save all the changes to 'tournaments.json'
    const tournaments = getAllTournaments()
    saveTournamentsData(tournaments)
  }
}