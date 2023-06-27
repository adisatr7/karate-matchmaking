import { Match, Participant } from "../../types"
import { getAthleteById } from "./athletes"
import { getKelasById } from "./kelas"
import { getTeamById } from "./teams"
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
 * @deprecated Use `generateMatches` or `setMatches` instead
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
 * @param updatedMatch The match object to delete
 */
export const updateMatch = (tournamentId: string, idKelas: string, updatedMatch: Match) => {
  let tournament = getTournamentById(tournamentId)
  let kelas = getKelasById(tournamentId, idKelas)

  // Check if tournament and kelas is found
  if (tournament && kelas) {
    let matchIndex = kelas.matches.findIndex(match => match.idMatch === updatedMatch.idMatch)

    // Check if match is found
    if (matchIndex !== -1) {

      // Replace the old match with the new one
      kelas.matches[matchIndex] = updatedMatch

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


/**
 * Set the matches of a kelas that will be played
 * 
 * @param tournamentId The tournament ID to set the matches to
 * @param idKelas The kelas ID to set the matches to
 * @param matches The matches to set
 */
export const setMatches = (tournamentId: string, idKelas: string, matches: Match[]) => {
  let tournament = getTournamentById(tournamentId)
  let kelas = getKelasById(tournamentId, idKelas)

  // Check if tournament and kelas is found
  if (tournament && kelas) {

    // Set the matches
    kelas.matches = matches

    // Save the changes to `tournaments.data`
    saveTournamentsData(tournament)
  }
}


/**
 * Generate matches for the tournament bracket. Do NOT use this function if the
 * tournament has already started!
 * 
 * @param tournamentId The tournament ID to generate the matches for
 * @param kelasId The kelas ID to generate the matches for
 * @param participatingTeams The teams to generate the matches from
 */
export const generateBracket = (tournamentId: string, kelasId: string, participatingTeams: Participant[]) => {
  const matches: Match[] = []

  // Calculate the total rounds needed based on the number of teams participating
  const totalRounds = Math.ceil(Math.log2(participatingTeams.length))

  // Create a list of teams that will be participating in the tournament
  const teams: Participant[] = participatingTeams.map((value) => ({
    idAtlet: value.idAtlet,
    idTim: value.idTim,
    namaAtlet: value.namaAtlet,
    namaTim: value.namaTim,
  }))

  // Starting match ID
  let matchId = 101
  let nextMatchId = 101 + Math.pow(2, totalRounds)

  // Generate the matches
  for (let round = 1; round <= totalRounds; round++) {
    const roundMatches: Match[] = []
    const teamsInRound = Math.pow(2, totalRounds - round)

    for (let i = 0; i < teamsInRound; i++) {
      const petarung1 = teams[i * 2]
      const petarung2 = teams[i * 2 + 1]

      const athlete1 = getAthleteById(petarung1.idAtlet)
      const athlete2 = getAthleteById(petarung2.idAtlet)
      const team1 = getTeamById(petarung1.idTim!)
      const team2 = getTeamById(petarung2.idTim!)

      // Create the match name
      let matchName = ""
      if (round === totalRounds)
        matchName = "Grand Final"
      else if (round === totalRounds - 1)
        matchName = `Semi Final ${matchId - 99}`
      else
        matchName = `Match ${matchId - 99}`

      const match: Match = {
        idMatch: `${matchId}`,
        namaMatch: matchName,
        idMatchBerikutnya: round === totalRounds ? "" : `${nextMatchId + i + 1}`,
        waktuMain: "",
        status: "akan main",
        pemenang: null,
        idTim: [
          {
            ...petarung1,
            namaAtlet: athlete1 ? athlete1.namaAtlet : "",
            namaTim: team1 ? team1.namaTim : "",
          },
          {
            ...petarung2,
            namaAtlet: athlete2 ? athlete2.namaAtlet : "",
            namaTim: team2 ? team2.namaTim : "",
          },
        ],
      }
      roundMatches.push(match)
      matchId++
    }

    // If there are odd number of teams, add a "Bye" team, which is a team that
    // will automatically advance to the next round
    if (teamsInRound < participatingTeams.length) {
      const byeTeam: Participant = {
        idAtlet: "bye",
        idTim: "bye",
        namaAtlet: "Bye",
        namaTim: "Bye",
      }
      const byeMatch: Match = {
        idMatch: `${matchId}`,
        namaMatch: `Bye ${matchId - 100}`,
        idMatchBerikutnya: round === totalRounds ? "" : `${nextMatchId + teamsInRound + 1}`,
        waktuMain: "",
        status: "akan main",
        pemenang: null,
        idTim: [
          {
            ...byeTeam,
          },
          {
            ...teams[teams.length - 1],
            namaAtlet: getAthleteById(teams[teams.length - 1].idAtlet)?.namaAtlet || "",
            namaTim: getTeamById(teams[teams.length - 1].idTim!)?.namaTim || "",
          },
        ],
      }
      roundMatches.push(byeMatch)
      matchId++
    }
    matches.push(...roundMatches)
    nextMatchId += roundMatches.length
    teams.length = teamsInRound
  }
  // Set the matches
  setMatches(tournamentId, kelasId, matches)
}