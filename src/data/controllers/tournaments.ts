import { BaseDirectory, readTextFile } from "@tauri-apps/api/fs"
import { Tournament } from "../../types"
import defaultTournamentsData from "../defaults/defaultTournaments.json"
import { createDataFolder, writeInto } from "./utils"
import useNotification from "../../hooks/useNotification"


/**
 * Save passed argument into 'tournaments.data' file
 * 
 * @param tournaments List of all tournaments to be saved to 'tournaments.data' file
 */
export const saveTournamentsData = async (tournaments: Tournament[] | any) => {

  // Create 'data' folder (if it doesn't exist yet)
  await createDataFolder()

  // Write into 'tournaments.data' file
  await writeInto(tournaments, "tournaments")
}


/**
 * Initiate tournaments data by creating the 'data' folder and 
 * 'tournaments.data' file if they don't exist yet
 */
export const assignDefaultTournamentsData = async () => {
  await saveTournamentsData(defaultTournamentsData)
}


/**
 * Read tournaments data from 'tournaments.data' file
 * 
 * @returns The list of tournaments
 */
export const getAllTournaments = async (): Promise<Tournament[]> => {
  return new Promise(async (resolve, reject) => {
      readTextFile(
        "data/tournaments.data", {
        dir: BaseDirectory.AppData
      }
      ).then(res => {
        const tournaments = JSON.parse(res)
        resolve(tournaments)
      }
      ).catch(err => {
        useNotification("Terjadi kesalahan saat membaca data pertandingan", err)
        assignDefaultTournamentsData()
        reject(err)
      })
  })
}


/**
 * Find a tournament object by its id
 * 
 * @param id The id of the tournament
 * @returns  The tournament object
 */
export const getTournamentById = async (id: string): Promise<Tournament> => {
  return new Promise(async (resolve, reject) => {
    const tournaments = await getAllTournaments()
    const tournament = tournaments.find(tournament => tournament!.idPertandingan === id)

    if (tournament) {
      resolve(tournament)
    } else {
      reject("Pertandingan tidak ditemukan")
    }
  })
}


/**
 * Add a tournament object and save it to 'tournaments.data' file
 * 
 * @param tournament The tournament object to be added
 */
export const addTournament = async (tournament: Tournament) => {
  let tournaments = await getAllTournaments()
  tournaments.push(tournament)

  saveTournamentsData(tournaments)
}


/**
 * Update a tournament object and save it to 'tournaments.data' file
 * 
 * @param newTournament The new tournament object
 */
export const updateTournament = async (newTournament: Tournament) => {
  let tournaments = await getAllTournaments()
  const tournamentIndex = tournaments.findIndex(tournament => tournament!.idPertandingan === newTournament!.idPertandingan)

  tournaments[tournamentIndex] = newTournament

  saveTournamentsData(tournaments)
}


/**
 * Delete a tournament object and save the updated list to 'tournaments.data' file
 * 
 * @param id The id of the tournament to be deleted
 */
export const deleteTournament = async (id: string) => {
  let tournaments = await getAllTournaments()
  const tournamentIndex = tournaments.findIndex(tournament => tournament!.idPertandingan === id)

  tournaments.splice(tournamentIndex, 1)

  saveTournamentsData(tournaments)
}


/**
 * Get the total participants of a tournament of the given ID by summing 
 * all participants inside all the tournament's kelas
 * 
 * @param tournamentId The id of the tournament
 */
export const getTotalParticipants = async (tournamentId: string) => {
  const tournament = await getTournamentById(tournamentId)

  if (tournament) {
    let totalParticipants = 0

    tournament.kelas.forEach(kelas => {
      totalParticipants += kelas.daftarTim.length
    })

    return totalParticipants
  }
}