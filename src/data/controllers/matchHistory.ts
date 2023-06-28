import { MatchHistoryType } from "../../types"
import { createFolder, writeInto } from "../../utils/fileManager"
import defaultMatchHistoryData from "../defaults/defaultMatchHistory.json"
import { BaseDirectory, readTextFile } from "@tauri-apps/api/fs"
import useNotification from "../../hooks/useNotification"


/**
 * 
 * @param matchHistory 
 */
export const saveMatchHistoryData = async (matchHistory: MatchHistoryType[]) => {
  await createFolder()
  await writeInto(matchHistory, "matchHistory")
}


/**
 * Initialize match history data by assigning default match 
 * history data into the 'matchHistory.data' file
 */
export const assignDefaultMatchHistoryData = async () => {
  saveMatchHistoryData(defaultMatchHistoryData)
}


/**
 * Get all athlete's match history
 * 
 * @returns Everyone's match history
 */
const getAllMatchHistory = (): MatchHistoryType[] => {
  let matchHistory: MatchHistoryType[] = []

  readTextFile(
    "data/matchHistory.data", {
    dir: BaseDirectory.AppData
  }).then(res => {
    matchHistory = JSON.parse(res)
  }).catch(err => {
    useNotification("Terjadi kesalahan saat membaca file", err)
  })

  return matchHistory
}


/**
 * Get all match history of an athlete from 'matchHistory.data' file
 * 
 * @param idAtlet The ID of the athlete the match history belongs to
 * @returns List of all match history of specified athlete
 */
export const getMatchHistory = (idAtlet: string): MatchHistoryType[] => {
  let matchHistory: MatchHistoryType[] = []

  readTextFile(
    "data/matchHistory.data", {
    dir: BaseDirectory.AppData
  }).then(res => {
    const data = JSON.parse(res)
    const filteredData = data.filter((match: MatchHistoryType) => {
      match.idAtlet === idAtlet
    })
    matchHistory = filteredData
  }).catch(err => {
    useNotification("Terjadi kesalahan saat membaca file", err)
  })

  return matchHistory
}


/**
 * Add a match history to 'matchHistory.data' file
 * 
 * @param matchHistory The match history to be added
 */
export const addMatchHistory = (matchHistory: MatchHistoryType) => {
  const data = getAllMatchHistory()
  data.push(matchHistory)
  saveMatchHistoryData(data)
}


/**
 * Update a match history in 'matchHistory.data' file
 * 
 * @param matchHistory The match history to be updated
 */
export const updateMatchHistory = (matchHistory: MatchHistoryType) => {
  const data = getAllMatchHistory()
  const index = data.findIndex((match: MatchHistoryType) => {
    match.idMatch === matchHistory.idMatch && match.idAtlet === matchHistory.idAtlet
  })
  data[index] = matchHistory
  saveMatchHistoryData(data)
}


/**
 * Delete all match history with the given id from 'matchHistory.data' file
 * 
 * @param matchId The ID of the match history to be deleted
 */
export const deleteMatchHistory = (matchId: string) => {
  const data = getAllMatchHistory()
  const filteredData = data.filter((match: MatchHistoryType) => {
    match.idMatch !== matchId
  })
  saveMatchHistoryData(filteredData)
}