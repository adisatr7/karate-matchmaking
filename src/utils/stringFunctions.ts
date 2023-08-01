/**
 * Formats a string to be in title case
 * 
 * @param string The string to be formatted
 * @returns The formatted string
 */
export function toTitleCase (string: string) {
  // Split the string into an array of words
  const words = string.split(" ")

  // Capitalize the first letter of each word
  const capitalizedWords = words.map(word => {
    // Convert the word to lowercase and then capitalize the first letter
    const capitalizedFirstLetter = word.charAt(0).toUpperCase()
    const restOfWord = word.slice(1).toLowerCase()

    // Concatenate the capitalized first letter with the rest of the word
    return capitalizedFirstLetter + restOfWord
  })

  // Join the words back into a single string
  const formattedString = capitalizedWords.join(" ")

  return formattedString
}

/**
 * Formats a string to be in sentence case
 * Example: "hello_world" -> "Hello World"
 * 
 * @param string The string to be formatted
 * @returns The formatted string
 */
export function toSentenceCase (string: string) {

  // Convert snake case to sentence case
  const snakeToSentence = (snakeCase: string) => {
    const words = snakeCase.split("_")
    const capitalizedWords = words.map(word => word.charAt(0).toUpperCase() + word.slice(1))
    return capitalizedWords.join(" ")
  }

  // Convert camel case to sentence case
  const camelToSentence = (camelCase: string) => {
    const words = camelCase.replace(/([A-Z])/g, " $1").split(" ")
    const capitalizedWords = words.map(word => word.charAt(0).toUpperCase() + word.slice(1))
    return capitalizedWords.join(" ")
  }

  // Check if the string is in snake case or camel case
  if (string.includes("_"))
    return snakeToSentence(string)
  else
    return camelToSentence(string)
}