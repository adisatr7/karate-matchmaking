import { BaseDirectory, createDir, readTextFile, writeTextFile } from "@tauri-apps/api/fs"
import { Atlet, Tim } from "../../types"
import useNotification from "../../hooks/useNotification"
import defaultTeamsData from "../defaults/defaultTeams.json"
import { getAthleteById, joinTeam, leaveTeam } from "./athletes"


/**
 * Save passed argument into 'teams.data' file
 * 
 * @param teams List of all teams to be saved to 'teams.data' file
 */
export const saveTeamsData = async (teams: Tim[] | any) => {
  
    // Create 'data' folder (if it doesn't exist yet)
    await createDir("data", {
      dir: BaseDirectory.AppData,
      recursive: true
    }).catch(err => {
      useNotification("Terjadi kesalahan saat membuat folder baru", err)
    })
  
    // Write into 'teams.data' file
    await writeTextFile({
      path: "data/teams.data",
      contents: JSON.stringify(teams)
    },
      { dir: BaseDirectory.AppData }
    ).catch(err => {
      useNotification("Terjadi kesalahan saat membuat file baru", err)
    })
}


/**
 * Initiate teams data by creating the 'data' folder and
 * 'teams.data' file if they don't exist yet
 */
export const setDefaultTeamsData = async () => {
  saveTeamsData(defaultTeamsData)
}


/**
 * Get all teams from 'teams.data' file
 * 
 * @returns List of all teams from 'teams.data' file
 */
export const getAllTeams = (): Tim[] => {
  let teams: Tim[] = []

  readTextFile(
    "data/teams.data", {
    dir: BaseDirectory.AppData,
  }).then(data => {
    teams = JSON.parse(data)
  }).catch(err => {
    console.log("Terjadi kesalahan saat membaca file `teams.data`", err)
  })

  return teams
}


/**
 * Get team object with the specified id
 * 
 * @param id Team's id to be searched
 * @returns Team object with the specified id
 */
export const getTeamById = (id: string): Tim | undefined => {
  const teams = getAllTeams()
  return teams.find(team => team.idTim === id)
}


/**
 * Add new team to 'teams.data' file
 * 
 * @param newTeam Team object to be added
 */
export const addTeam = (newTeam: Tim) => {
  const teams = getAllTeams()
  teams.push(newTeam)

  saveTeamsData(teams)
}


/**
 * Update team data in 'teams.data' file
 * 
 * @param updatedTeam Team object to be updated
 */
export const updateTeam = (updatedTeam: Tim) => {
  const teams = getAllTeams()
  const index = teams.findIndex(tim => tim.idTim === updatedTeam.idTim)
  teams[index] = updatedTeam

  saveTeamsData(teams)
}


/**
 * Delete team from 'teams.data' file
 * 
 * @param id Team's id to be deleted
 */
export const deleteTeam = (id: string) => {
  const teams = getAllTeams()
  const index = teams.findIndex(team => team.idTim === id)
  teams.splice(index, 1)

  saveTeamsData(teams)
}


/**
 * Get all members object from the specified team
 * 
 * @param teamId Team's id to get all members from
 * @returns List of all members object from the specified team
 */
export const getAllMembers = (teamId: string): Atlet[] => {
  const teams = getAllTeams()
  const team = teams.find(team => team.idTim === teamId)
  const members: Atlet[] = []

  team?.anggota.forEach(memberId => {
    const member = getAthleteById(memberId)
    if(member) members.push(member)
  })

  return members
}


/**
 * Get all members id from the specified team
 * 
 * @param teamId Team's id to get all members from
 * @returns List of all members id from the specified team
 */
export const getAllMembersId = (teamId: string): string[] => {
  const teams = getAllTeams()
  const team = teams.find(team => team.idTim === teamId)
  return team?.anggota || []
}


/**
 * Check if a member with specified ID belongs to a particular team
 * 
 * @param teamId Team's ID to be checked
 * @param memberId Member's ID to be checked
 * 
 * @returns True if the member belongs to the team, false otherwise
 */
export const isMember = (teamId: string, memberId: string): boolean => {
  const members = getAllMembersId(teamId)
  return members.includes(memberId)
}


/**
 * Add new member to a team
 * 
 * @param teamId Team's ID the new member will be added to
 * @param newMemberId The new member ID to be added to the team
 */
export const addMember = (teamId: string, newMemberId: string) => {
  const teams = getAllTeams()
  const team = teams.find(team => team.idTim === teamId)
  team?.anggota.push(newMemberId)

  const newMember = getAthleteById(newMemberId)

  // If the member is already in a team
  if(newMember?.idTimSekarang !== teamId)

    // Remove it from the previous team member list first
    kickMember(newMember!.idTimSekarang, newMemberId)

    // Update member's active team ID
    joinTeam(newMember!, teamId)

  // Save changes
  saveTeamsData(teams)
}


/**
 * Remove a member from a team
 * 
 * @param teamId Team's id the member will be removed from
 * @param memberId Member's id to be removed from the team
 */
export const kickMember = (teamId: string, memberId: string) => {
  const teams = getAllTeams()
  const team = teams.find(team => team.idTim === teamId)
  const index = team?.anggota.findIndex(id => id === memberId)
  team?.anggota.splice(index!, 1)

  // Update member's teamId
  const member = getAthleteById(memberId)

  if(member?.idTimSekarang === teamId)
    leaveTeam(member!)

  // Save changes
  saveTeamsData(teams)
}