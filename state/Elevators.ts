import AsyncLock from 'async-lock'
import { Direction, Elevator, ElevatorRequest, Elevators, ElevatorStatus } from '../lib/BuildingActions'
const ELEVATOR_REQUEST_LOCK = 'elevator-request-lock'

const ELEVATOR_LOCK = 'elevator-lock'

export const elevatorRequestQueue: ElevatorRequest[] = []

// export let elevators: Elevator[] = []
export let elevators: Elevators = {}

const _lock = new AsyncLock()

export const resetElevators = () : void => {
  elevators = {
    'Elevator A': {
      name: 'Elevator A',
      currFloor: 1,
      destFloor: 1,
      people: [],
      status: ElevatorStatus.READY,
      direction: Direction.GOING_UP
    },
    'Elevator B': {
      name: 'Elevator B',
      currFloor: 1,
      destFloor: 1,
      people: [],
      status: ElevatorStatus.READY,
      direction: Direction.GOING_UP
    }
  }
}

export const getElevatorsAsArray = () : Elevator[] => {
  return Object.keys(elevators).map(name => {
    return elevators[name]
  })
}

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

const elevatorIsReady = (elevator: Elevator) => elevator.status === ElevatorStatus.READY

const elevatorOnSameFloorAsRequest = (elevator: Elevator, elevatorRequest: ElevatorRequest) => elevator.currFloor === elevatorRequest.fromFloor

const elevatorGoingInSameDirectionAsRequest = (elevator: Elevator, elevatorRequest: ElevatorRequest) => elevator.status === ElevatorStatus.MOVING && elevator.direction === elevatorRequest.direction

export const elevatorShouldOpenDoors = (elevator: Elevator) : boolean => {
  return elevator.currFloor === elevator.destFloor && elevator.status === ElevatorStatus.MOVING
}

const getDirection = (currFloor = -1, destFloor = -1) => {
  return currFloor > destFloor ? Direction.GOING_DOWN : Direction.GOING_UP
}

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

export const getElevatorRequest = () : ElevatorRequest | null => {
  if (elevatorRequestQueue.length === 0) { return null }

  return elevatorRequestQueue[0]
}

export const elevatorHeadingTowardsFloor = (elevator: Elevator, elevatorRequest: ElevatorRequest) : boolean => {
  return elevator.currFloor <= elevatorRequest.fromFloor && elevatorRequest.fromFloor <= elevator.destFloor
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

export const handleElevatorRequest = async () : Promise<Elevator | void> => {
  const elevatorRequest = getElevatorRequest()

  console.log('retrieved elevatorRequest', elevatorRequest)

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
  await removeElevatorRequest()

  const elevatorTakingRequest = await elevatorTakesRequest(chosenElevator, elevatorRequest)

  return elevatorTakingRequest
}

// export const getAvailableElevator = () => {
//   const elevatorRequest = elevatorRequestQueue[0]

//   console.log('elevatorRequest', elevatorRequest)

//   const elevatorsArr = getElevatorsAsArray()

//   //  if the elevator is already on the floor and it's going in the right direction, then open the door
//   const availableElevatorAlreadyOnFloor = elevatorsArr.find(elevator => elevatorShouldOpenDoor(elevator, elevatorRequest))
//   // availableElevatorAlreadyOnFloor?.status = ElevatorStatus.DOORS_OPENING
//   if (availableElevatorAlreadyOnFloor) { return availableElevatorAlreadyOnFloor }

//   //  find the closest elevator that is ready (not currently servicing any requests)

//   const availableElevator = elevatorsArr.find(elevator => elevator.status === ElevatorStatus.READY)

//   if (!availableElevator) {
//     console.log('no elevators are available')

//     return null
//   }

//   console.log(`${availableElevator.name} is currently on ${availableElevator.currFloor} and will accept the request to go to ${elevatorRequest.fromFloor}`)

//   availableElevator.direction = getDirection(availableElevator.currFloor, elevatorRequest.fromFloor)

//   availableElevator.status = ElevatorStatus.MOVING
// }

export const elevatorMoves = async ({ name }: Elevator) : Promise<void> => {
  await _lock.acquire(ELEVATOR_LOCK, () => {
    const elevator = elevators[name]
    elevator.direction === Direction.GOING_UP ? elevator.currFloor += 1 : elevator.currFloor -= 1
  })
}

export const elevatorOpensDoors = async ({ name }: Elevator) : Promise<void> => {
  await _lock.acquire(ELEVATOR_LOCK, () => {
    const elevator = elevators[name]
    elevator.status = ElevatorStatus.DOORS_OPENING
  })
}

export const elevatorTakesRequest = async ({ name }: Elevator, elevatorRequest: ElevatorRequest) : Promise<void> => {
  await _lock.acquire(ELEVATOR_LOCK, () => {
    const elevator = elevators[name]

    elevator.destFloor = elevatorRequest.fromFloor
    elevator.direction = getDirection(elevator.currFloor, elevatorRequest.fromFloor)
    elevator.status = ElevatorStatus.MOVING
  })
}
