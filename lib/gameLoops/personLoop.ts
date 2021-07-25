import AsyncLock from 'async-lock'

import { PersonStatus } from '../types/EventPayloads'

import { Person } from '../state/Person'
import { StateManager } from '../state/StateManager'
import { PersonBroadcaster } from '../broadcasters/PersonBroadcaster'

/**
 * This personLoop represents the actions of an individual person.  It (1) both makes and listens for changes in the Person status and (2) broadcasts updates to the client using `personBroadcaster`
 * @param person
 * @param stateManager
 * @param lock
 */
export const personLoop = async (person: Person, stateManager: StateManager, personBroadcaster: PersonBroadcaster, lock: AsyncLock) : Promise<void> => {
  await lock.acquire(person.lockName, async () => {
  //  this personLoop now has the specific lock for this person

    if (person.status === PersonStatus.NEWLY_SPAWNED) {
      await stateManager.addElevatorRequest(person)

      //  specify that the user is now waiting for the elevator
      person.status = PersonStatus.WAITING_FOR_ELEVATOR

      personBroadcaster.broadcastPersonRequestedElevator(person)
    }

    //  if elevator opens doors AND

    // elevators.getElevatorPickingUpPerson(person.)
    // const elevatorPickingUpPerson = await getElevatorPickingUpPerson(person)

    // if (elevatorPickingUpPerson) {
    //   await elevatorGetsRiderAndDestination(elevatorPickingUpPerson, person)

    //   elevatorBroadcaster.broadcastElevatorReceivesDestination(elevatorPickingUpPerson)
    // }
  })
}
