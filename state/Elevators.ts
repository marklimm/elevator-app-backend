import AsyncLock from 'async-lock'
import { Direction, Elevator, ElevatorRequest, ElevatorStatus } from '../lib/BuildingActions'
const ELEVATOR_REQUEST_LOCK = 'elevator-request-lock'

const elevatorRequestQueue: ElevatorRequest[] = []

export let elevators: Elevator[] = []

const _lock = new AsyncLock()

export const initElevators = () : void => {
  elevators = [
    {
      name: 'Elevator A',
      currFloor: 0,
      destFloor: 0,
      people: [],
      status: ElevatorStatus.READY,
      direction: Direction.GOING_UP
    },
    {
      name: 'Elevator B',
      currFloor: 0,
      destFloor: 0,
      people: [],
      status: ElevatorStatus.READY,
      direction: Direction.GOING_UP
    }
  ]
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

export const getAvailableElevator = () => {
  const elevatorRequest = elevatorRequestQueue[0]

  console.log('elevatorRequest', elevatorRequest)

  //  if the elevator is already on the floor and it's going in the right direction, then open the door
  const availableElevatorAlreadyOnFloor = elevators.find(elevator => elevatorShouldOpenDoor(elevator, elevatorRequest))
  // availableElevatorAlreadyOnFloor?.status = ElevatorStatus.DOORS_OPENING
  if (availableElevatorAlreadyOnFloor) { return availableElevatorAlreadyOnFloor }

  //  find the closest elevator that is ready (not currently servicing any requests)

  const availableElevator = elevators.find(elevator => elevator.status === ElevatorStatus.READY)

  if (!availableElevator) {
    console.log('no elevators are available')

    return null
  }

  console.log(`${availableElevator.name} is currently on ${availableElevator.currFloor} and will accept the request to go to ${elevatorRequest.fromFloor}`)

  availableElevator.direction = availableElevator.currFloor > elevatorRequest.fromFloor ? Direction.GOING_DOWN : Direction.GOING_UP

  availableElevator.status = ElevatorStatus.MOVING
}
