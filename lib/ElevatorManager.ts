import { Elevator, ElevatorRequest, ElevatorStatus } from './types/Elevator'
import { elevatorTakesRequest, getElevatorRequest, removeElevatorRequest } from '../state/ElevatorRequests'

import { elevatorHeadingTowardsFloor, getElevatorsAsArray } from '../state/Elevators'

const getClosestReadyElevator = ({ fromFloor }: ElevatorRequest) : Elevator | null => {
  const elevatorsArr = getElevatorsAsArray()

  const readyElevators = elevatorsArr.filter(elevator => {
    return elevator.status === ElevatorStatus.READY
  })

  if (readyElevators.length === 0) { return null }

  //  arbitrarily high value
  let closestFloorDistance = 1000
  let closestReadyElevator = readyElevators[0]

  readyElevators.forEach(elevator => {
    const floorDistance = Math.abs(fromFloor - elevator.currFloor)

    console.log(`${elevator.name} on ${elevator.currFloor} is ${floorDistance} away from ${fromFloor}`)

    if (floorDistance < closestFloorDistance) {
      closestFloorDistance = floorDistance
      closestReadyElevator = elevator
    }
  })

  return closestReadyElevator
}

const chooseElevator = (elevatorRequest: ElevatorRequest) => {
  console.log('-- chooseElevator START --')
  const elevatorsArr = getElevatorsAsArray()

  //  is there already an elevator that is heading in the direction of the requested floor?
  const elevatorHeadingTowardsRequestAlready = elevatorsArr.find(elevator => elevatorHeadingTowardsFloor(elevator, elevatorRequest)
  )

  console.log('elevatorHeadingTowardsRequestAlready', elevatorHeadingTowardsRequestAlready)

  if (elevatorHeadingTowardsRequestAlready) { return elevatorHeadingTowardsRequestAlready }

  //  what is the closest "Ready" elevator to the destFloor?
  const closestReadyElevator = getClosestReadyElevator(elevatorRequest)

  console.log('closestReadyElevator', closestReadyElevator)
  console.log('-- chooseElevator END --')
  return closestReadyElevator
}

export const handleElevatorRequest = () : Elevator | void => {
  const elevatorRequest = getElevatorRequest()

  if (!elevatorRequest) {
    console.log('no elevator requests to process')
    return
  }

  const chosenElevator = chooseElevator(elevatorRequest)

  if (!chosenElevator) {
    console.log('no elevator is available to handle the request - will try again later')
    return
  }

  console.log(`${chosenElevator.name} is currently on ${chosenElevator.currFloor} and will accept the request to go to ${elevatorRequest.fromFloor}`)

  //  remove the elevator request from the queue since it's been processed
  removeElevatorRequest()

  const elevatorTakingRequest = elevatorTakesRequest(chosenElevator, elevatorRequest)

  return elevatorTakingRequest
}
