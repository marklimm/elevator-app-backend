import { getRandomFloor } from './Randomizer'

describe('getRandomFloor', () => {
  it('selects a random floor when no `notThisFloor` is specified', () => {
    const highestFloorNumber = 10

    const selectedFloor = getRandomFloor(highestFloorNumber)

    expect(typeof (selectedFloor)).toBe('number')
    expect(selectedFloor).toBeLessThanOrEqual(highestFloorNumber)
  })

  it('selects a random floor NOT equal to `notThisFloor` when `notThisFloor` is specified', () => {
    const highestFloorNumber = 10
    const notThisFloorNumber = 5

    const selectedFloor = getRandomFloor(highestFloorNumber, notThisFloorNumber)

    expect(selectedFloor !== notThisFloorNumber).toBe(true)
  })
})
