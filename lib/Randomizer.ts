
/**
 * This value will fluctuate
 */
let numPeopleInBuilding = 500

/**
 * This function is used to return a value that changes over time, and is used as part of testing the "game loop"
 * @returns
 */
export const getNumberOfPeopleInBuilding = () : number => {
  //  let's say that the number of people will also fluctuate between -5 to 5

  //  a random number between 0 and 10 (including 0 and 10)
  const randomChange = Math.floor(Math.random() * 11)

  //  convert a range between -5 to +5
  const changedBy = randomChange - 5

  numPeopleInBuilding += changedBy

  return numPeopleInBuilding
}
