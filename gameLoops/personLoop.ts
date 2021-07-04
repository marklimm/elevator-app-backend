
import { people, makeElevatorRequest } from '../state/People'

import { PersonStatus } from '../lib/types/Person'

import { broadcastPersonRequestedElevator } from '../lib/Broadcaster'

export const personLoop = async (name: string) : Promise<void> => {
  const person = people[name]

  if (person.status === PersonStatus.NEWLY_SPAWNED) {
    await makeElevatorRequest(person)

    //  broadcast that someone has just made an elevator request
    // console.log('person who just made an elevator request', person.status)

    broadcastPersonRequestedElevator(person)
  }

  // await processGettingOnAndPressingButton()
}
