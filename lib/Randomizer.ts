
/**
 * This function is not used anymore.  It returns a value that changes over time
 * @returns
 */
export const getChangeByAmount = () : number => {
  //  let's say that the number of people will also fluctuate between -5 to 5

  //  a random number between 0 and 10 (including 0 and 10)
  const randomChange = Math.floor(Math.random() * 11)

  //  convert a range between -5 to +5
  const changedBy = randomChange - 5

  return changedBy
}

export const getRandomName = (usedNames: string[]) : string => {
  const names = ['Cassidy', 'Grant', 'Lambert', 'Mark', 'Nikki', 'Paulo', 'Wrex']

  //  only choose names that aren't in the `usedNames` list
  let selectedName = ''
  do {
    selectedName = names[Math.floor(Math.random() * names.length)]
  } while (usedNames.indexOf(selectedName) > -1)

  return selectedName
}

export const getRandomFloor = (numFloors: number, notThisFloor = -1) : number => {
  let selectedFloor

  while (!selectedFloor || selectedFloor === notThisFloor) {
    selectedFloor = Math.floor(Math.random() * numFloors) + 1
  }

  return selectedFloor
}
