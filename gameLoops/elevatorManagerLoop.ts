import AsyncLock from 'async-lock'

import { findElevatorToTakeRequest } from '../lib/ElevatorManager'
import { elevatorBroadcaster } from '../lib/socketIOSetup'

const _lock = new AsyncLock()
const ELEVATOR_REQUEST_LOCK = 'elevator-request-lock'

export const elevatorManagerLoop = async () : Promise<void> => {
  // const elevatorsArr = getElevatorsAsArray()

  const elevatorTakingRequest = await _lock.acquire(ELEVATOR_REQUEST_LOCK, () => {
    const elevatorTakingRequest = findElevatorToTakeRequest()

    return elevatorTakingRequest
  })

  if (elevatorTakingRequest) {
    elevatorBroadcaster.broadcastElevatorTakingRequest(elevatorTakingRequest)
  }
}
