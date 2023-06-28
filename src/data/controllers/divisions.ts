import { DivisionType } from "../../types"
import { getAllTournaments, getTournamentById, saveTournamentsData } from "./tournaments"
import useNotification from "../../hooks/useNotification"
import { getTeamById } from "./teams"
import { getAthleteById } from "./athletes"


/**
 * Get all division from a tournament
 * 
 * @param tournamentId Tournament ID to get all division from
 * @returns List of all division from the tournament
 */
export const getAllDivisions = async (tournamentId: string): Promise<DivisionType[]> => {
  return new Promise(async (resolve, reject) => {

    // Get the specified tournament data
    let tournament = await getTournamentById(tournamentId)

    // Create a list of division from the specified tournament
    let division: DivisionType[] = []

    // If tournament is found, get all division from the tournament and resolve the promise with the list of division
    if (tournament) {
      division = tournament.divisions
      resolve(division)
    }

    // If tournament is not found, send error notification and reject the promise
    else {
      useNotification("Terjadi kesalahan saat membaca data division", "Tidak dapat menemukan data pertandingan!")
      reject("Tidak dapat menemukan data pertandingan!")
    }
  })
}


/**
 * Get a division from a tournament by its ID
 * 
 * @param tournamentId Tournament ID to get the division from 
 * @param idDivision ID of the division to get
 * 
 * @returns The division object
 */
export const getDivisionById = async (tournamentId: string, idDivision: string): Promise<DivisionType> => {
  return new Promise(async (resolve, reject) => {

    const daftarDivision = await getAllDivisions(tournamentId)    
    const division = daftarDivision.find(division => division.divisionId === idDivision)

    if (division)
      resolve(division)

    else {
      useNotification("Terjadi kesalahan saat membaca data division", "Tidak dapat menemukan data division!")
      reject("")
    }
  })
}


/**
 * Add a new division to a tournament
 * 
 * @param tournamentId Tournament ID to add the division to
 * @param newDivision The new division object
 */
export const addDivision = async (tournamentId: string, newDivision: DivisionType) => {
  let tournament = await getTournamentById(tournamentId)
  let division = await getAllDivisions(tournamentId)

  if (tournament) {
    division.push(newDivision)
    tournament.divisions = division

    saveTournamentsData(tournament)
  }

  else {
    useNotification("Terjadi kesalahan saat menambahkan data division", "Tidak dapat menemukan data pertandingan!")
  }
}


/**
 * Delete a division from a tournament
 * 
 * @param tournamentId Tournament ID to delete the division from
 * @param updatedDivision The updated division object
 */
export const updateDivision = async (tournamentId: string, updatedDivision: DivisionType) => {
  let tournament = await getTournamentById(tournamentId)
  let division = await getAllDivisions(tournamentId)

  if (tournament) {
    division = division.map(division => division.divisionId === updatedDivision.divisionId ? updatedDivision : division)
    tournament.divisions = division

    saveTournamentsData(tournament)
  }

  else {
    useNotification("Terjadi kesalahan saat mengubah data division", "Tidak dapat menemukan data pertandingan!")
  }
}


/**
 * Delete a division from a tournament
 * 
 * @param tournamentId Tournament ID to delete the division from
 * @param idDivision ID of the division to delete
 */
export const deleteDivision = async (tournamentId: string, idDivision: string) => {
  const tournaments = await getAllTournaments()

  // Get the target tournament and division object
  let tournament = tournaments.find(tournament => tournament.tournamentId === tournamentId)
  let division = await getAllDivisions(tournamentId)

  // Remove the division from the specified tournament
  if (tournament) {
    division = division.filter(division => division.divisionId !== idDivision)
    tournament.divisions = division

    // Save all the changes to 'tournaments.json'
    saveTournamentsData(tournaments)
  }

  // If the tournament is not found
  else {
    useNotification("Terjadi kesalahan saat menghapus data division", "Tidak dapat menemukan data pertandingan!")
  }
}


/**
 * Register a team to a division
 * 
 * @param tournamentId Tournament ID to register the team to
 * @param idDivision ID of the division to register the team to
 * @param teamId ID of the team to be registered
 */
export const registerTeam = async (tournamentId: string, idDivision: string, teamId: string, athleteId: string) => {

  // Get the division, athlete, and team object
  const division = await getDivisionById(tournamentId, idDivision)
  const athlete = await getAthleteById(athleteId)
  const team = await getTeamById(teamId)
  
  // If the division, athlete, and team is found, register the team and athlete to the division
  if (division && athlete && team) {
    division.registeredTeams.push({
      teamId: teamId,
      teamName: team.teamName,
      athleteId: athlete?.athleteId,
      athleteName: athlete?.athleteName
    })
    updateDivision(tournamentId, division)
  }
}


/**
 * Remove a team from a division
 * 
 * @param tournamentId The tournament ID to unregister the team from
 * @param idDivision The division ID to unregister the team from
 * @param teamId The team ID to be unregistered
 */
export const unregisterTeam = async (tournamentId: string, idDivision: string, teamId: string) => {

  // Get the division object
  const division = await getDivisionById(tournamentId, idDivision)
  
  // If division is found, remove the team from the division
  if (division) {
    division.registeredTeams = division.registeredTeams.filter(team => team.teamId !== teamId)
    
    // Update the division object
    updateDivision(tournamentId, division)
  }
}