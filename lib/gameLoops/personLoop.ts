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

      person.status = PersonStatus.REQUESTED_ELEVATOR

      personBroadcaster.broadcastPersonRequestedElevator(person)
    }

    const elevatorTakingPerson = await stateManager.elevatorHasOpenDoorsAndPersonWantsToGoInTheSameDirection(person)

    if (elevatorTakingPerson) {
      person.status = PersonStatus.ENTERED_THE_ELEVATOR

      personBroadcaster.broadcastPersonEnteredElevator(person, elevatorTakingPerson)
    }

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
