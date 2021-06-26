import { addPeople } from '../state/People'
import { getChangeByAmount } from '../lib/Randomizer'

export const fluctuatingNumPeopleLoop = () : void => {
  //  increase or decrease the amount of people in the building to simulate people entering and leaving the building
  addPeople(getChangeByAmount())
}
