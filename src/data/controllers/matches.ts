import useNotification from "../../hooks/useNotification"
import { MatchType, ContestantType } from "../../types"
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
export const getAllMatches = async (tournamentId: string, idKelas: string): Promise<MatchType[]> => {
  return new Promise(async (resolve, reject) => {
    let tournament = await getTournamentById(tournamentId)
    let kelas = await getKelasById(tournamentId, idKelas)
    let matches: MatchType[] = []

    // If tournament and kelas is found, get all the matches from the kelas
    if (tournament && kelas) {
      matches = kelas.matches
      resolve(matches)
    }
    else {
      useNotification("Terjadi kesalahan saat membaca data pertandingan", "Tidak dapat menemukan data pertandingan!")
      reject("Tidak dapat menemukan data pertandingan!")
    }
  })
}


/**
 * Get a match from a kelas by its ID
 * 
 * @param tournamentId The tournament ID to get the match from
 * @param idKelas The kelas ID to get the match from
 * @param idMatch The match ID to get
 * @returns The match object
 */
export const getMatchById = async (tournamentId: string, idKelas: string, idMatch: string): Promise<MatchType> => {

  return new Promise(async (resolve, reject) => {
    // Find the match by its ID
    const matches = await getAllMatches(tournamentId, idKelas)
    const match = matches.find(match => match.matchId === idMatch)
  
    // Return the match if found, otherwise return undefined
    if (match)
      resolve(match)
    
    // If match is not found, send error notification and reject the promise
    else {
      useNotification("Terjadi kesalahan saat membaca data pertandingan", "Tidak dapat menemukan data pertandingan!")
      reject("Tidak dapat menemukan data pertandingan!")
    }
  })
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
export const addMatch = async (tournamentId: string, idKelas: string, newMatch: MatchType) => {
  let tournament = await getTournamentById(tournamentId)
  let kelas = await getKelasById(tournamentId, idKelas)

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
export const updateMatch = async (tournamentId: string, idKelas: string, updatedMatch: MatchType) => {
  let tournament = await getTournamentById(tournamentId)
  let kelas = await getKelasById(tournamentId, idKelas)

  // Check if tournament and kelas is found
  if (tournament && kelas) {
    let matchIndex = kelas.matches.findIndex(match => match.matchId === updatedMatch.matchId)

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
export const deleteMatch = async (tournamentId: string, idKelas: string, idMatch: string) => {
  let tournament = await getTournamentById(tournamentId)
  let kelas = await getKelasById(tournamentId, idKelas)

  // Check if tournament and kelas is found
  if (tournament && kelas) {
    let matchIndex = kelas.matches.findIndex(match => match.matchId === idMatch)

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
export const setMatches = async (tournamentId: string, idKelas: string, matches: MatchType[]) => {
  let tournament = await getTournamentById(tournamentId)
  let kelas = await getKelasById(tournamentId, idKelas)

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
export const generateBracket = async (tournamentId: string, kelasId: string, participatingTeams: ContestantType[]) => {
  const matches: MatchType[] = []

  // Calculate the total rounds needed based on the number of teams participating
  const totalRounds = Math.ceil(Math.log2(participatingTeams.length))

  // Create a list of teams that will be participating in the tournament
  const teams: ContestantType[] = participatingTeams.map((value) => ({
    idAtlet: value.athleteId,
    idTim: value.teamId,
    namaAtlet: value.athleteName,
    namaTim: value.teamName,
  }))

  // Starting match ID
  let matchId = 101
  let nextMatchId = 101 + Math.pow(2, totalRounds)

  // Generate the matches
  for (let round = 1; round <= totalRounds; round++) {
    const roundMatches: MatchType[] = []
    const teamsInRound = Math.pow(2, totalRounds - round)

    for (let i = 0; i < teamsInRound; i++) {
      const petarung1 = teams[i * 2]
      const petarung2 = teams[i * 2 + 1]

      const athlete1 = await getAthleteById(petarung1.athleteId)
      const athlete2 = await getAthleteById(petarung2.athleteId)
      const team1 = await getTeamById(petarung1.teamId)
      const team2 = await getTeamById(petarung2.teamId)

      // Create the match name
      let matchName = ""
      if (round === totalRounds)
        matchName = "Grand Final"
      else if (round === totalRounds - 1)
        matchName = `Semi Final ${matchId - 99}`
      else
        matchName = `Match ${matchId - 99}`

      const match: MatchType = {
        matchId: `${matchId}`,
        matchName: matchName,
        nextMatchId: round === totalRounds ? "" : `${nextMatchId + i + 1}`,
        playDate: "",
        status: "akan main",
        winner: null,
        teams: [
          {
            ...petarung1,
            athleteName: athlete1 ? athlete1.athleteName : "",
            teamName: team1 ? team1.teamName : "",
          },
          {
            ...petarung2,
            athleteName: athlete2 ? athlete2.athleteName : "",
            teamName: team2 ? team2.teamName : "",
          },
        ],
      }
      roundMatches.push(match)
      matchId++
    }

    // If there are odd number of teams, add a "Bye" team, which is a team that
    // will automatically advance to the next round
    if (teamsInRound < participatingTeams.length) {
      const byeTeam: ContestantType = {
        athleteId: "bye",
        teamId: "bye",
        athleteName: "Bye",
        teamName: "Bye",
      }

      const atlet = await getAthleteById(teams[teams.length - 1].athleteId)
      const namaAtlet = atlet.athleteName

      const tim = await getTeamById(teams[teams.length - 1].teamId!)
      const namaTim = tim.teamName

      const byeMatch: MatchType = {
        matchId: `${matchId}`,
        matchName: `Bye ${matchId - 100}`,
        nextMatchId: round === totalRounds ? "" : `${nextMatchId + teamsInRound + 1}`,
        playDate: "",
        status: "akan main",
        winner: null,
        teams: [
          {
            ...byeTeam,
          },
          {
            ...teams[teams.length - 1],
            athleteName: namaAtlet || "",
            teamName: namaTim || "",
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