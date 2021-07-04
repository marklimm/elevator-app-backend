
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

  console.log('elevatorRequestQueue after removal', elevatorRequestQueue)

  return elevatorRequest
}

export const getElevatorRequest = () : ElevatorRequest | null => {
  if (elevatorRequestQueue.length === 0) { return null }

  return elevatorRequestQueue[0]
}

export const elevatorTakesRequest = (elevator: Elevator, elevatorRequest: ElevatorRequest) : Elevator => {
  //  I feel like there would be more complicated logic if an elevator is stopping mid-way to also answer a new request that is going in the same direction that the elevator is already going

  const updatedElevator = {
    ...elevator,
    destFloor: elevatorRequest.destFloor,
    direction: getDirection(elevator.currFloor, elevatorRequest.destFloor),
    status: ElevatorStatus.MOVING
  }

  elevators[elevator.name] = updatedElevator

  return updatedElevator
}
