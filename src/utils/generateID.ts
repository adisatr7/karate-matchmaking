/**
 * Generate a random ID for a new object
 * 
 * @returns Random ID
 */
export default function generateID () {
  const timestamp = new Date().getTime().toString(36)
  const randomString = Math.random().toString(36).substring(2, 15)
  return timestamp + randomString
}