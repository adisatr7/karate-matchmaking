import { BaseDirectory, createDir, readTextFile, writeTextFile } from "@tauri-apps/api/fs"
import { Pertandingan } from "../../types"
import useNotification from "../../hooks/useNotification"
import defaultTournamentsData from "../defaults/defaultTournaments.json"


/**
 * Save passed argument into 'tournaments.data' file
 * 
 * @param tournaments List of all tournaments to be saved to 'tournaments.data' file
 */
export const saveTournamentsData = async (tournaments: Pertandingan[] | any) => {

  // Create 'data' folder (if it doesn't exist yet)
  await createDir("data", {
    dir: BaseDirectory.AppData,
    recursive: true
  }).catch(err => {
    useNotification("Terjadi kesalahan saat membuat folder baru", err)
  })

  // Write into 'tournaments.data' file
  await writeTextFile({
    path: "data/tournaments.data",
    contents: JSON.stringify(tournaments)
  },
    { dir: BaseDirectory.AppData }
  ).catch(err => {
    useNotification("Terjadi kesalahan saat membuat file baru", err)
  })
}


/**
 * Initiate tournaments data by creating the 'data' folder and 
 * 'tournaments.data' file if they don't exist yet
 */
export const setDefaultTournamentsData = async () => {
  saveTournamentsData(defaultTournamentsData)
}


/**
 * Read tournaments data from 'tournaments.data' file
 * 
 * @returns The list of tournaments
 */
export const getAllTournaments = (): Pertandingan[] => {
  let tournaments: Pertandingan[] = []

  readTextFile(
    "data/tournaments.data", {
    dir: BaseDirectory.AppData,
  }).then(data => {
    tournaments = JSON.parse(data)
  }).catch(err => {
    console.log("Terjadi kesalahan saat membaca file `tournaments.data`", err)
  })

  return tournaments
}


/**
 * Find a tournament object by its id
 * 
 * @param id The id of the tournament
 * @returns  The tournament object
 */
export const getTournamentById = (id: string): Pertandingan | undefined => {
  const tournaments = getAllTournaments()

  return tournaments.find(tournament => tournament.idPertandingan === id)
}


/**
 * Add a tournament object and save it to 'tournaments.data' file
 * 
 * @param tournament The tournament object to be added
 */
export const addTournament = async (tournament: Pertandingan) => {
  let tournaments = getAllTournaments()
  tournaments.push(tournament)

  saveTournamentsData(tournaments)
}


/**
 * Update a tournament object and save it to 'tournaments.data' file
 * 
 * @param newTournament The new tournament object
 */
export const updateTournament = async (newTournament: Pertandingan) => {
  let tournaments = getAllTournaments()
  const tournamentIndex = tournaments.findIndex(tournament => tournament.idPertandingan === newTournament.idPertandingan)

  tournaments[tournamentIndex] = newTournament

  saveTournamentsData(tournaments)
}


/**
 * Delete a tournament object and save the updated list to 'tournaments.data' file
 * 
 * @param id The id of the tournament to be deleted
 */
export const deleteTournament = async (id: string) => {
  let tournaments = getAllTournaments()
  const tournamentIndex = tournaments.findIndex(tournament => tournament.idPertandingan === id)

  tournaments.splice(tournamentIndex, 1)

  saveTournamentsData(tournaments)
}