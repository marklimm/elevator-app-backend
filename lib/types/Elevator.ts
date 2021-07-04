import { Person } from './Person'

export enum Direction {
  GOING_DOWN = 'going-down',
  GOING_UP = 'going-up'
}

/**
 * The request object for when the user requests that the elevator go to a destination floor
 */
export interface ElevatorRequest {
  destFloor: number,
  direction: Direction
}

export enum ElevatorStatus {
  DOORS_CLOSING = 'doors-closing',
  DOORS_OPENING = 'doors-opening',
  INACTIVE = 'inactive',
  MOVING = 'moving',
  READY = 'ready',
  PERSON_ENTERING = 'person-entering',
}

export interface Elevator {
  name: string
  currFloor: number
  destFloor: number
  people: Person[]
  status: ElevatorStatus,
  direction: Direction
}

export interface Elevators {
  [key: string]: Elevator
}
