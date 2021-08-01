
export const getRandomFloor = (numFloors: number, notThisFloor = -1) : number => {
  let selectedFloor

  while (!selectedFloor || selectedFloor === notThisFloor) {
    selectedFloor = Math.floor(Math.random() * numFloors) + 1
  }

  return selectedFloor
}
