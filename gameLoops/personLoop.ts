
import { people, makeElevatorRequest } from '../state/People'
import { getElevatorPickingUpPerson, giveElevatorADestination } from '../state/Elevators'

import { PersonStatus } from '../lib/types/EventPayloads'

import { personBroadcaster, elevatorBroadcaster } from '../lib/broadcasts/Broadcaster'

export const personLoop = async (name: string) : Promise<void> => {
  const person = people[name]

  //  now I'm thinking this needs to be rephrased because we need the lock around both the person and the elevator request

  if (person.status === PersonStatus.NEWLY_SPAWNED) {
    await makeElevatorRequest(person)

    //  broadcast that someone has just made an elevator request
    // console.log('person who just made an elevator request', person.status)

    personBroadcaster.broadcastPersonRequestedElevator(person)
    return
  }

  const elevatorPickingUpPerson = await getElevatorPickingUpPerson(person)

  if (elevatorPickingUpPerson) {
    await giveElevatorADestination(elevatorPickingUpPerson, person)

    elevatorBroadcaster.broadcastElevatorReceivesDestination(elevatorPickingUpPerson)
  }
}
