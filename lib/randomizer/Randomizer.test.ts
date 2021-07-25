import { getChangeByAmount } from './Randomizer'

it('the change by amount falls within the expected range', () => {
  const numberOfPeople = getChangeByAmount()

  const min = -5
  const max = 5

  expect(numberOfPeople).toBeGreaterThanOrEqual(min)
  expect(numberOfPeople).toBeLessThanOrEqual(max)
})
