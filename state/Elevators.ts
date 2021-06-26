import AsyncLock from 'async-lock'
import { ElevatorRequest } from '../lib/BuildingActions'
const ELEVATOR_REQUEST_LOCK = 'elevator-request-lock'

const elevatorRequestQueue: ElevatorRequest[] = []

const _lock = new AsyncLock()

export const addElevatorRequest = async (elevatorRequest: ElevatorRequest) : Promise<void> => {
  await _lock.acquire(ELEVATOR_REQUEST_LOCK, () => {
    elevatorRequestQueue.push(elevatorRequest)
  })
}

export const removeElevatorRequest = async () : Promise<ElevatorRequest | null | undefined> => {
  if (elevatorRequestQueue.length === 0) { return null }

  const elevatorRequest = await _lock.acquire(ELEVATOR_REQUEST_LOCK, () => {
    return elevatorRequestQueue.shift()
  })

  return elevatorRequest
}
