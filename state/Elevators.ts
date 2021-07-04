import AsyncLock from 'async-lock'
import { Direction, Elevator, ElevatorRequest, Elevators, ElevatorStatus } from '../lib/types/Elevator'

const ELEVATOR_LOCK = 'elevator-lock'

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

// const elevatorIsReady = (elevator: Elevator) => elevator.status === ElevatorStatus.READY

// const elevatorOnSameFloorAsRequest = (elevator: Elevator, elevatorRequest: ElevatorRequest) => elevator.currFloor === elevatorRequest.fromFloor

// const elevatorGoingInSameDirectionAsRequest = (elevator: Elevator, elevatorRequest: ElevatorRequest) => elevator.status === ElevatorStatus.MOVING && elevator.direction === elevatorRequest.direction

export const elevatorShouldOpenDoors = (elevator: Elevator) : boolean => {
  return elevator.currFloor === elevator.destFloor && elevator.status === ElevatorStatus.MOVING
}

export const getDirection = (currFloor = -1, destFloor = -1) : Direction => {
  return currFloor > destFloor ? Direction.GOING_DOWN : Direction.GOING_UP
}

export const elevatorHeadingTowardsFloor = (elevator: Elevator, elevatorRequest: ElevatorRequest) : boolean => {
  return elevator.currFloor <= elevatorRequest.fromFloor && elevatorRequest.fromFloor <= elevator.destFloor
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
