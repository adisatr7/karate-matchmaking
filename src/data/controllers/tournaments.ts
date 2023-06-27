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
export const setDefaultTournamentsData = async () => {
  saveTournamentsData(defaultTournamentsData)
}


/**
 * Read tournaments data from 'tournaments.data' file
 * 
 * @returns The list of tournaments
 */
export const getAllTournaments = (): Tournament[] => {
  let tournaments: Tournament[] = []

  readTextFile(
    "data/tournaments.data", {
    dir: BaseDirectory.AppData,
  }).then(data => {
    tournaments = JSON.parse(data)
  }).catch(err => {
    useNotification("Terjadi kesalahan saat membaca file `tournaments.data`", err)
  })

  return tournaments
}


/**
 * Find a tournament object by its id
 * 
 * @param id The id of the tournament
 * @returns  The tournament object
 */
export const getTournamentById = (id: string): Tournament | undefined => {
  const tournaments = getAllTournaments()

  return tournaments.find(tournament => tournament.idPertandingan === id)
}


/**
 * Add a tournament object and save it to 'tournaments.data' file
 * 
 * @param tournament The tournament object to be added
 */
export const addTournament = async (tournament: Tournament) => {
  let tournaments = getAllTournaments()
  tournaments.push(tournament)

  saveTournamentsData(tournaments)
}


/**
 * Update a tournament object and save it to 'tournaments.data' file
 * 
 * @param newTournament The new tournament object
 */
export const updateTournament = async (newTournament: Tournament) => {
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