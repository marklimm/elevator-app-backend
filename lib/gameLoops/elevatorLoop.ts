import AsyncLock from 'async-lock'

import { ElevatorStatus } from '../types/EventPayloads'
import { elevatorBroadcaster } from '../socketIOSetup'
import { Elevator } from '../state/Elevator'

//  this elevatorLoop is responsible for (1) changing the status of the Elevator and (2) broadcasting updates to the client using `elevatorBroadcaster`

export const elevatorLoop = async (elevator: Elevator, lock: AsyncLock) : Promise<void> => {
  //  take the lock for the specific elevator
  await lock.acquire(elevator.lockName, async () => {
    //  this elevatorLoop now has the specific lock for this elevator

    // const cantOpenDoorsStatuses = [ElevatorStatus.INACTIVE, ElevatorStatus.DOORS_CLOSING, ElevatorStatus.DOORS_OPENING]

    if (elevator.shouldOpenDoors()) {
      //  elevator has reached its destination, open the doors

      elevator.openDoors()

      elevatorBroadcaster.broadcastElevatorOpensDoors(elevator)

      return
    }

    if (elevator.status === ElevatorStatus.RECEIVED_REQUEST) {
      elevatorBroadcaster.broadcastElevatorTakingRequest(elevator)

      elevator.startMoving()
    }

    if (elevator.status === ElevatorStatus.MOVING_TO_FLOOR) {
      elevator.movesToFloor()

      elevatorBroadcaster.broadcastElevatorMoving(elevator)
    }
  })
}
