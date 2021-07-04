import AsyncLock from 'async-lock'

import { handleElevatorRequest } from '../lib/ElevatorManager'
import { broadcastElevatorTakingRequest } from '../lib/Broadcaster'

const _lock = new AsyncLock()
const ELEVATOR_REQUEST_LOCK = 'elevator-request-lock'

export const elevatorManagerLoop = async () : Promise<void> => {
  // const elevatorsArr = getElevatorsAsArray()

  const elevatorTakingRequest = await _lock.acquire(ELEVATOR_REQUEST_LOCK, () => {
    const elevatorTakingRequest = handleElevatorRequest()

    return elevatorTakingRequest
  })

  if (elevatorTakingRequest) {
    broadcastElevatorTakingRequest(elevatorTakingRequest)
  }
}
