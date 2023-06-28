import { DivisionType } from "../../types"
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
export const getAllKelas = async (tournamentId: string): Promise<DivisionType[]> => {
  return new Promise(async (resolve, reject) => {

    // Get the specified tournament data
    let tournament = await getTournamentById(tournamentId)

    // Create a list of kelas from the specified tournament
    let kelas: DivisionType[] = []

    // If tournament is found, get all kelas from the tournament and resolve the promise with the list of kelas
    if (tournament) {
      kelas = tournament.divisions
      resolve(kelas)
    }

    // If tournament is not found, send error notification and reject the promise
    else {
      useNotification("Terjadi kesalahan saat membaca data kelas", "Tidak dapat menemukan data pertandingan!")
      reject("Tidak dapat menemukan data pertandingan!")
    }
  })
}


/**
 * Get a kelas from a tournament by its ID
 * 
 * @param tournamentId Tournament ID to get the kelas from 
 * @param idKelas ID of the kelas to get
 * 
 * @returns The kelas object
 */
export const getKelasById = async (tournamentId: string, idKelas: string): Promise<DivisionType> => {
  return new Promise(async (resolve, reject) => {

    const daftarKelas = await getAllKelas(tournamentId)    
    const kelas = daftarKelas.find(kelas => kelas.divisionId === idKelas)

    if (kelas)
      resolve(kelas)

    else {
      useNotification("Terjadi kesalahan saat membaca data kelas", "Tidak dapat menemukan data kelas!")
      reject("")
    }
  })
}


/**
 * Add a new kelas to a tournament
 * 
 * @param tournamentId Tournament ID to add the kelas to
 * @param newKelas The new kelas object
 */
export const addKelas = async (tournamentId: string, newKelas: DivisionType) => {
  let tournament = await getTournamentById(tournamentId)
  let kelas = await getAllKelas(tournamentId)

  if (tournament) {
    kelas.push(newKelas)
    tournament.divisions = kelas

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
export const updateKelas = async (tournamentId: string, updatedKelas: DivisionType) => {
  let tournament = await getTournamentById(tournamentId)
  let kelas = await getAllKelas(tournamentId)

  if (tournament) {
    kelas = kelas.map(kelas => kelas.divisionId === updatedKelas.divisionId ? updatedKelas : kelas)
    tournament.divisions = kelas

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
export const deleteKelas = async (tournamentId: string, idKelas: string) => {
  const tournaments = await getAllTournaments()

  // Get the target tournament and kelas object
  let tournament = tournaments.find(tournament => tournament.tournamentId === tournamentId)
  let kelas = await getAllKelas(tournamentId)

  // Remove the kelas from the specified tournament
  if (tournament) {
    kelas = kelas.filter(kelas => kelas.divisionId !== idKelas)
    tournament.divisions = kelas

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
export const registerTeam = async (tournamentId: string, idKelas: string, teamId: string, athleteId: string) => {

  // Get the kelas, athlete, and team object
  const kelas = await getKelasById(tournamentId, idKelas)
  const athlete = await getAthleteById(athleteId)
  const team = await getTeamById(teamId)
  
  // If the kelas, athlete, and team is found, register the team and athlete to the kelas
  if (kelas && athlete && team) {
    kelas.registeredTeams.push({
      teamId: teamId,
      teamName: team.teamName,
      athleteId: athlete?.athleteId,
      athleteName: athlete?.athleteName
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
export const unregisterTeam = async (tournamentId: string, idKelas: string, teamId: string) => {

  // Get the kelas object
  const kelas = await getKelasById(tournamentId, idKelas)
  
  // If kelas is found, remove the team from the kelas
  if (kelas) {
    kelas.registeredTeams = kelas.registeredTeams.filter(team => team.teamId !== teamId)
    
    // Update the kelas object
    updateKelas(tournamentId, kelas)
  }
}