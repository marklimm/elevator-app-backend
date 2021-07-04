
import { Elevator, ElevatorRequest, ElevatorStatus } from '../lib/types/Elevator'

import { elevators, getDirection } from './Elevators'

export const elevatorRequestQueue: ElevatorRequest[] = []

//  it's implied that the user already has the elevatorRequestQueue look when calling these methods.  However this is not currently being enforced

export const addElevatorRequest = (elevatorRequest: ElevatorRequest) : void => {
  // await _lock.acquire(ELEVATOR_REQUEST_LOCK, () => {
  elevatorRequestQueue.push(elevatorRequest)
  // })
}

export const removeElevatorRequest = () : ElevatorRequest | null | undefined => {
  if (elevatorRequestQueue.length === 0) { return null }

  const elevatorRequest = elevatorRequestQueue.shift()

  return elevatorRequest
}

export const getElevatorRequest = () : ElevatorRequest | null => {
  if (elevatorRequestQueue.length === 0) { return null }

  return elevatorRequestQueue[0]
}

export const elevatorTakesRequest = (elevator: Elevator, elevatorRequest: ElevatorRequest) : Elevator => {
  const updatedElevator = {
    ...elevator,
    destFloor: elevatorRequest.fromFloor,
    direction: getDirection(elevator.currFloor, elevatorRequest.fromFloor),
    status: ElevatorStatus.MOVING
  }

  elevators[elevator.name] = updatedElevator

  return updatedElevator
}
