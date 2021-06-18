import { getNumberOfPeopleInBuilding } from './Randomizer'

test('the number of people in the building falls within the expected range', () => {
  const numberOfPeople = getNumberOfPeopleInBuilding()

  const min = 495
  const max = 505

  expect(numberOfPeople).toBeGreaterThanOrEqual(min)
  expect(numberOfPeople).toBeLessThanOrEqual(max)
})
