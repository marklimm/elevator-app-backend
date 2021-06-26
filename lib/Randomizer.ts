
/**
 * This function is used to return a value that changes over time, and is used as part of testing the "game loop"
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

export const getRandomName = () : string => {
  const names = ['Grant', 'Lambert', 'Nikki', 'Paulo', 'Wrex']

  const selectedName = names[Math.floor(Math.random() * names.length)]

  return selectedName
}

export const getRandomFloor = (numFloors: number, notThisFloor = -1) : number => {
  let selectedFloor

  while (selectedFloor === undefined || selectedFloor === notThisFloor) {
    selectedFloor = Math.floor(Math.random() * numFloors) + 1
  }

  return selectedFloor
}
