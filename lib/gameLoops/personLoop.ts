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

//  there's the lock for individual persons and individual elevators, and then there's the lock for the array of elevators and the array of people ... I don't know if I've arrived at the most clear solution for expressing how these should be handled

export const personLoop = async ({ person, stateManager, personBroadcaster, lock } : PersonLoopParams) : Promise<void> => {
  await lock.acquire(person.lockName, async () => {
    //  this personLoop now has the specific lock for this person

    //  I need to think through how to properly order this --> newly spawned --> requested elevator

    if (person.status === PersonStatus.NEWLY_SPAWNED) {
      await stateManager.addElevatorRequest(person)

      person.requestsElevator()

      personBroadcaster.broadcastPersonRequestedElevator(person)

      return
    }

    const elevatorTakingPerson = await stateManager.elevatorHasOpenDoorsAndPersonWantsToGoInTheSameDirection(person)

    if (elevatorTakingPerson) {
      person.entersElevator(elevatorTakingPerson)

      //  take the lock for the specific elevator
      await lock.acquire(elevatorTakingPerson.lockName, async () => {
        elevatorTakingPerson.takesPerson(person)

        return elevatorTakingPerson
      })

      personBroadcaster.broadcastPersonEnteredElevator(person)

      return
    }

    if (person.status === PersonStatus.ENTERED_THE_ELEVATOR && !!person.elevator) {
      person.pressesButton()

      //  take the lock for the specific elevator
      await lock.acquire(person.elevator.lockName, async () => {
        //  if this person.elevator value is null then something unexpected happened.  Putting this here to appease typescript, otherwise it'll throw an error on the next lines
        if (!person.elevator) { return }

        person.elevator.receivedDestination(person.destFloor)
      })

      personBroadcaster.broadcastPersonPressedButton(person)
    }
  })
}
