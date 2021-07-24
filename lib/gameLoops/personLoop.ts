import AsyncLock from 'async-lock'

import { PersonStatus } from '../types/EventPayloads'

import { personBroadcaster } from '../socketIOSetup'

import { Person } from '../state/Person'
import { StateManager } from '../StateManager'

//  this personLoop is responsible for (1) changing the status of the Person and (2) broadcasting updates to the client using `personBroadcaster`

export const personLoop = async (person: Person, stateManager: StateManager, lock: AsyncLock) : Promise<void> => {
  await lock.acquire(person.lockName, async () => {
  //  this personLoop now has the specific lock for this person

    if (person.status === PersonStatus.NEWLY_SPAWNED) {
      await stateManager.addElevatorRequest(person)

      //  broadcast that someone has just made an elevator request
      // console.log('person who just made an elevator request', person.status)

      //  specify that the user is now waiting for the elevator
      person.status = PersonStatus.WAITING_FOR_ELEVATOR

      personBroadcaster.broadcastPersonRequestedElevator(person)
    }

    // elevators.getElevatorPickingUpPerson(person.)
    // const elevatorPickingUpPerson = await getElevatorPickingUpPerson(person)

    // if (elevatorPickingUpPerson) {
    //   await elevatorGetsRiderAndDestination(elevatorPickingUpPerson, person)

    //   elevatorBroadcaster.broadcastElevatorReceivesDestination(elevatorPickingUpPerson)
    // }
  })
}
