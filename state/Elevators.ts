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
      currFloor: 0,
      destFloor: 0,
      people: [],
      status: ElevatorStatus.READY,
      direction: Direction.GOING_UP
    },
    'Elevator B': {
      name: 'Elevator B',
      currFloor: 0,
      destFloor: 0,
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

const elevatorShouldOpenDoor = (elevator: Elevator, elevatorRequest: ElevatorRequest) => {
  return elevatorOnSameFloorAsRequest(elevator, elevatorRequest) && (elevatorIsReady(elevator) || elevatorGoingInSameDirectionAsRequest(elevator, elevatorRequest))
}

const getDirection = (currFloor = -1, destFloor = -1) => {
  return currFloor > destFloor ? Direction.GOING_DOWN : Direction.GOING_UP
}

export const getAvailableElevator = () => {
  const elevatorRequest = elevatorRequestQueue[0]

  console.log('elevatorRequest', elevatorRequest)

  const elevatorsArr = getElevatorsAsArray()

  //  if the elevator is already on the floor and it's going in the right direction, then open the door
  const availableElevatorAlreadyOnFloor = elevatorsArr.find(elevator => elevatorShouldOpenDoor(elevator, elevatorRequest))
  // availableElevatorAlreadyOnFloor?.status = ElevatorStatus.DOORS_OPENING
  if (availableElevatorAlreadyOnFloor) { return availableElevatorAlreadyOnFloor }

  //  find the closest elevator that is ready (not currently servicing any requests)

  const availableElevator = elevatorsArr.find(elevator => elevator.status === ElevatorStatus.READY)

  if (!availableElevator) {
    console.log('no elevators are available')

    return null
  }

  console.log(`${availableElevator.name} is currently on ${availableElevator.currFloor} and will accept the request to go to ${elevatorRequest.fromFloor}`)

  availableElevator.direction = getDirection(availableElevator.currFloor, elevatorRequest.fromFloor)

  availableElevator.status = ElevatorStatus.MOVING
}

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
