import { Elevator, ElevatorRequest, ElevatorStatus } from './types/Elevator'
import { elevatorTakesRequest, getElevatorRequest, removeElevatorRequest } from '../state/ElevatorRequests'

import { elevatorHeadingTowardsFloor, getElevatorsAsArray } from '../state/Elevators'

const getClosestReadyElevator = (elevatorsArr: Elevator[], { destFloor }: ElevatorRequest) : Elevator | null => {
  const readyElevators = elevatorsArr.filter(elevator => {
    return elevator.status === ElevatorStatus.READY
  })

  if (readyElevators.length === 0) { return null }

  //  arbitrarily high value
  let closestFloorDistance = 1000
  let closestReadyElevator = readyElevators[0]

  readyElevators.forEach(elevator => {
    const floorDistance = Math.abs(destFloor - elevator.currFloor)

    console.log(`${elevator.name} on ${elevator.currFloor} is ${floorDistance} away from ${destFloor}`)

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

  //  use Object.values() instead?
  // Object.values(elevators)

  //  is there already an elevator that is heading in the direction of the requested floor?
  // const elevatorHeadingTowardsRequestAlready = elevatorsArr.find(elevator => elevatorHeadingTowardsFloor(elevator, elevatorRequest)
  // )

  // console.log('elevatorHeadingTowardsRequestAlready', elevatorHeadingTowardsRequestAlready)

  // if (elevatorHeadingTowardsRequestAlready) { return elevatorHeadingTowardsRequestAlready }

  //  what is the closest "Ready" elevator to the destFloor?
  const closestReadyElevator = getClosestReadyElevator(elevatorsArr, elevatorRequest)

  console.log('closestReadyElevator', closestReadyElevator)
  console.log('-- chooseElevator END --')
  return closestReadyElevator
}

export const findElevatorToTakeRequest = () : Elevator | void => {
  console.log('-- START -- findElevatorToTakeRequest')

  //  the ELEVATOR_REQUEST_LOCK has already been taken before this function is called

  const elevatorRequest = getElevatorRequest()

  if (!elevatorRequest) {
    // console.log('no elevator requests to process')
    return
  }

  console.log('elevatorRequest to be processed', elevatorRequest)

  const chosenElevator = chooseElevator(elevatorRequest)

  console.log('chosenElevator', chosenElevator)

  if (!chosenElevator) {
    console.log('no elevator is available to handle the request - will try again later')
    return
  }

  console.log(`${chosenElevator.name} is currently on ${chosenElevator.currFloor} and will accept the request to go to ${elevatorRequest.destFloor}`)

  //  remove the elevator request from the queue since it's been processed
  removeElevatorRequest()

  const elevatorTakingRequest = elevatorTakesRequest(chosenElevator, elevatorRequest)

  console.log('elevatorTakingRequest', elevatorTakingRequest)

  console.log('-- END -- findElevatorToTakeRequest')

  return elevatorTakingRequest
}
