import AsyncLock from 'async-lock'

import { ElevatorStatus } from '../types/ElevatorAppTypes'
import { Elevator } from '../state/Elevator'
import { ElevatorBroadcaster } from '../broadcasters/ElevatorBroadcaster'

/**
 * This elevatorLoop represents the actions of an individual elevator.  It (1) both makes and listens for changes in the Elevator status and (2) broadcasts updates to the client using `elevatorBroadcaster`
 * @param elevator
 * @param lock
 */
export const elevatorLoop = async (elevator: Elevator, elevatorBroadcaster: ElevatorBroadcaster, lock: AsyncLock) : Promise<void> => {
  await lock.acquire(elevator.lockName, async () => {
    //  this elevatorLoop now has the specific lock for this elevator

    if (elevator.status === ElevatorStatus.DOORS_CLOSED) {
      elevator.startMoving()

      //  not sure if it's necessary to broadcast that the person is starting their ride on the elevator

      return
    }

    if (elevator.status === ElevatorStatus.DOORS_CLOSING) {
      elevator.doorsClosed()

      elevatorBroadcaster.broadcastElevatorDoorsClosed(elevator)

      return
    }

    if (elevator.status === ElevatorStatus.RECEIVED_DESTINATION) {
      elevatorBroadcaster.broadcastElevatorReceivedDestination(elevator)

      //  wait 1 second
      await new Promise(resolve => setTimeout(resolve, 1000))

      elevator.doorsClosing()

      elevatorBroadcaster.broadcastElevatorDoorsClosing(elevator)

      return
    }

    if (elevator.status === ElevatorStatus.DOORS_OPENING) {
      //  the elevator doors have finished opening

      elevator.doorsOpen()

      elevatorBroadcaster.broadcastElevatorDoorsOpen(elevator)

      return
    }

    if (elevator.shouldStopAndOpenDoors()) {
      //  elevator has reached its destination, open the doors

      elevator.doorsOpening()

      elevatorBroadcaster.broadcastElevatorOpeningDoors(elevator)

      return
    }

    if (elevator.status === ElevatorStatus.MOVING_TO_FLOOR) {
      elevator.movesToFloor()

      elevatorBroadcaster.broadcastElevatorMoving(elevator)
    }

    if (elevator.status === ElevatorStatus.TOOK_REQUEST) {
      elevatorBroadcaster.broadcastElevatorTookRequest(elevator)

      elevator.startMoving()
    }
  })
}
