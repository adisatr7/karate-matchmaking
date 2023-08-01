import { BaseDirectory, readDir } from "@tauri-apps/api/fs"
import { createFolder, writeInto } from "../../utils/fileManager"

import defaultUsers from "./defaultUsers.json"
import defaultTournaments from "./defaultTournaments.json"
import defaultDivisions from "./defaultDivisions.json"
import defaultMatches from "./defaultMatches.json"
import defaultTeams from "./defaultTeams.json"
import defaultAthletes from "./defaultAthletes.json"
import defaultMatchHistory from "./defaultMatchHistory.json"
import useNotification from "../../hooks/useNotification"

/**
 * Checks if the app data directory is empty. If it is, the app will
 * generate some default data inside the `%AppData%` folder.
 *
 * * On Windows: `C:\Users\<username>\AppData\Roaming\`
 * * On macOS: `/Users/<username>/Library/Application Support/`
 * * On Linux: `/home/<username>/.local/share/`
 */
export const verifyData = async (): Promise<void> => {
  /**
   * Checks if a folder exists in the app data directory.
   *
   * @param folderName The name of the folder to check
   * @returns `true` if the folder exists, `false` otherwise
   */
  const isExists = async (folderName: string): Promise<boolean> => {
    return new Promise(async (resolve, reject) => {
      try {
        // Read the folder
        const dirs = await readDir(folderName, {
          dir: BaseDirectory.AppData,
          recursive: true,
        })

        useNotification("Verify data is running!")
        // If the folder is not empty
        if (dirs) {
          resolve(true)
        }

        // If the folder is empty
        else resolve(false)
      } catch (error) {
        // In case of an error, reject the promise
        reject(error)
      }
    })
  }

  if (await isExists("auth")) assignDefaultUsersData()

  if (await isExists("tournaments")) assignDefaultTournamentsData()

  if (await isExists("divisions")) assignDefaultDivisionsData()

  if (await isExists("matches")) assignDefaultMatchData()

  if (await isExists("athletes")) assignDefaultAthletesData()

  if (await isExists("teams")) assignDefaultTeamsData()

  if (await isExists("matchHistory")) assignDefaultMatchHistoryData()
}

/**
 * Assign default users data and save it to 'auth/users.data'
 */
export const assignDefaultUsersData = async () => {
  await createFolder("auth")
  await writeInto({ currentUser: null, users: defaultUsers }, "auth/users")
}

/**
 * Assign default tournaments data and save it to 'tournaments/<tournamentId>.data'
 */
export const assignDefaultTournamentsData = async () => {
  await createFolder("tournaments")

  defaultTournaments.forEach(async (tournament) => {
    await writeInto(tournament, `tournaments/${tournament.tournamentId}`)
  })
}

/**
 * Assign default divisions data and save it to 'divisions/<divisionId>.data'
 */
export const assignDefaultDivisionsData = async () => {
  await createFolder("divisions")

  defaultDivisions.forEach(async (division) => {
    await writeInto(division, `divisions/${division.divisionId}`)
  })
}

/**
 * Assign default match history data and save it to 'matches/<matchId>.data'
 */
export const assignDefaultMatchData = async () => {
  await createFolder("matches")

  defaultMatches.forEach(async (match) => {
    await writeInto(match, `matches/${match.matchId}`)
  })
}

/**
 * Assign default teams data and save it to 'teams/<teamId>.data'
 */
export const assignDefaultTeamsData = async () => {
  await createFolder("teams")

  defaultTeams.forEach(async (team) => {
    await writeInto(team, `teams/${team.teamId}`)
  })
}

/**
 * Assign default athletes data and save it to 'athletes/<athleteId>.data'
 */
export const assignDefaultAthletesData = async () => {
  await createFolder("athletes")

  defaultAthletes.forEach(async (athlete) => {
    await writeInto(athlete, `athletes/${athlete.athleteId}`)
  })
}

/**
 * Assign default match history data and save it to 'matchHistory/<matchId>.data'
 */
export const assignDefaultMatchHistoryData = async () => {
  await createFolder("matchHistory")

  defaultMatchHistory.forEach(async (matchHistory) => {
    await writeInto(matchHistory, `matchHistory/${matchHistory.matchHistoryId}`)
  })
}
