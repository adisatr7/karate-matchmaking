import { Match } from "../../types"
import { getKelasById } from "./kelas"
import { getTournamentById, saveTournamentsData } from "./tournaments"


/**
 * Get all matches from a kelas
 * 
 * @param tournamentId The tournament ID to get all matches from 
 * @param idKelas The kelas ID to get all matches from
 * @returns List of all matches from the kelas
 */
export const getAllMatches = (tournamentId: string, idKelas: string): Match[] => {
  let tournament = getTournamentById(tournamentId)
  let kelas = getKelasById(tournamentId, idKelas)
  let matches: Match[] = []

  // If tournament and kelas is found, get all the matches from the kelas
  if (tournament && kelas)
    matches = kelas.matches

  return matches
}


/**
 * Get a match from a kelas by its ID
 * 
 * @param tournamentId The tournament ID to get the match from
 * @param idKelas The kelas ID to get the match from
 * @param idMatch The match ID to get
 * @returns The match object
 */
export const getMatchById = (tournamentId: string, idKelas: string, idMatch: string): Match | undefined => {

  // Find the match by its ID
  let match = getAllMatches(tournamentId, idKelas).find(match => match.idMatch === idMatch)

  // Return the match if found, otherwise return undefined
  return match || undefined
}


/**
 * Add a new match to a kelas
 * 
 * @param tournamentId The tournament ID to add the match to
 * @param idKelas The kelas ID to add the match to
 * @param newMatch The new match object
 */
export const addMatch = (tournamentId: string, idKelas: string, newMatch: Match) => {
  let tournament = getTournamentById(tournamentId)
  let kelas = getKelasById(tournamentId, idKelas)

  // Check if tournament and kelas is found
  if (tournament && kelas) {

    // Add the new match to the kelas
    kelas.matches.push(newMatch)

    // Save the changes to `tournaments.data`
    saveTournamentsData(tournament)
  }
}


/**
 * Delete a match from a kelas
 * 
 * @param tournamentId The tournament ID to delete the match from
 * @param idKelas The kelas ID to delete the match from
 * @param newMatch The match object to delete
 */
export const updateMatch = (tournamentId: string, idKelas: string, newMatch: Match) => {
  let tournament = getTournamentById(tournamentId)
  let kelas = getKelasById(tournamentId, idKelas)

  // Check if tournament and kelas is found
  if (tournament && kelas) {
    let matchIndex = kelas.matches.findIndex(match => match.idMatch === newMatch.idMatch)

    // Check if match is found
    if (matchIndex !== -1) {

      // Replace the old match with the new one
      kelas.matches[matchIndex] = newMatch

      // Save the changes to `tournaments.data`
      saveTournamentsData(tournament)
    }
  }
}


/**
 * Delete a match from a kelas
 * 
 * @param tournamentId The tournament ID to delete the match from
 * @param idKelas The kelas ID to delete the match from
 * @param idMatch The match ID to delete
 */
export const deleteMatch = (tournamentId: string, idKelas: string, idMatch: string) => {
  let tournament = getTournamentById(tournamentId)
  let kelas = getKelasById(tournamentId, idKelas)

  // Check if tournament and kelas is found
  if (tournament && kelas) {
    let matchIndex = kelas.matches.findIndex(match => match.idMatch === idMatch)

    // Check if match is found
    if (matchIndex !== -1) {

      // Delete the match
      kelas.matches.splice(matchIndex, 1)

      // Save the changes to `tournaments.data`
      saveTournamentsData(tournament)
    }
  }
}


export const calculateTotalMatches = (tournamentId: string, idKelas: string): number => {
  let tournament = getTournamentById(tournamentId)
  let kelas = getKelasById(tournamentId, idKelas)
  let totalMatches = 0

  // If tournament and kelas is found, get the total matches from the kelas
  if (tournament && kelas)
    totalMatches = kelas.matches.length

  return totalMatches
}