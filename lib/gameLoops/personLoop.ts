import AsyncLock from 'async-lock'

import { StateManager } from '../state/StateManager'
import { PersonBroadcaster } from '../broadcasters/PersonBroadcaster'
import { Person } from '../state/Person'
import { PersonStatus } from '../types/ElevatorAppTypes'

interface PersonLoopParams {
  person: Person
  stateManager: StateManager
  personBroadcaster: PersonBroadcaster
  lock: AsyncLock
}

export const personLoop = async ({ person, stateManager, personBroadcaster, lock } : PersonLoopParams) : Promise<void> => {
  await lock.acquire(person.lockName, async () => {
    //  this personLoop now has the specific lock for this person

    //  I need to think through how to properly order this --> newly spawned --> requested elevator

    if (person.status === PersonStatus.NEWLY_SPAWNED) {
      await stateManager.addElevatorRequest(person)

      personBroadcaster.broadcastPersonRequestedElevator(person)

      person.status = PersonStatus.REQUESTED_ELEVATOR
    }

    // if (person.status === PersonStatus.REQUESTED_ELEVATOR) {

    //   person.status = PersonStatus.WAITING_FOR_ELEVATOR

    //   return
    // }

    // if (person.status === PersonStatus.WAITING_FOR_ELEVATOR) {

    //   return
    // }

    //  if elevator opens doors AND

    // elevators.getElevatorPickingUpPerson(person.)
    // const elevatorPickingUpPerson = await getElevatorPickingUpPerson(person)

    // if (elevatorPickingUpPerson) {
    //   await elevatorGetsRiderAndDestination(elevatorPickingUpPerson, person)

    //   elevatorBroadcaster.broadcastElevatorReceivesDestination(elevatorPickingUpPerson)
    // }
  })
}
