//  I debated putting these types in separate files, however since these exact same types exist on both the client and server-side, it seems easier for me to just copy and paste this entire file.  I might change my mind on this later

//  client-initiated actions
export const INCREASE_PEOPLE = 'increase-people'
export const DECREASE_PEOPLE = 'decrease-people'
export const REQUEST_ELEVATOR = 'request-elevator'

//  server-initiated actions
export const ELEVATOR_STATUS = 'elevator-status'

export interface GameLoopIntervals {
  [key: string]: NodeJS.Timeout
}

export interface BuildingDetails {
  elevatorNames: string[]
  name: string
  numFloors: number
  yearBuilt: number
}

export enum UserStatus {
  NEWLY_SPAWNED = 'newly-spawned',
  WAITING_FOR_ELEVATOR = 'waiting-for-elevator',
  IN_ELEVATOR = 'in-elevator',
  AT_DESTINATION = 'at-destination'
}

export interface User {
  name: string,
  currFloor: number
  destFloor: number
  status: UserStatus
}

export interface Users {
  [key: string]: User
}

export interface BuildingStatus {
  numPeople?: number,
  users?: User[]
}

export enum OkOrError {
  Ok = 'ok',
  Error = 'error',
}

export interface ResponseStatus {
  error?: string
  message?: string
  status: OkOrError
}

/**
 * This response is sent when a client first connects to the realtime server
 */
export type NewConnectionBuildingResponse = BuildingDetails &
  BuildingStatus &
  ResponseStatus

export type StatusUpdateResponse = BuildingStatus & ResponseStatus

export enum Direction {
  GOING_DOWN = 'going-down',
  GOING_UP = 'going-up'
}

// /**
//  * The request object for when the user requests that the elevator go to a destination floor
//  */
export interface ElevatorRequest {
  fromFloor: number,
  direction: Direction
}

export enum ElevatorStatus {
  DOORS_CLOSING = 'doors-closing',
  DOORS_OPENING = 'doors-opening',
  INACTIVE = 'inactive',
  MOVING = 'moving',
  READY = 'ready',
  USERS_ENTERING = 'users-entering',
}

export interface Elevator {
  name: string
  currFloor: number
  destFloor: number
  people: User[]
  status: ElevatorStatus,
  direction: Direction
}

export interface Elevators {
  [key: string]: Elevator
}

export interface ElevatorResponse {
  elevator: Elevator
}

export type ElevatorStatusUpdate = ResponseStatus & ElevatorResponse

// /**
//  * The response sent after a user has requested that the elevator go to a destination floor
//  */
// export type ElevatorRequestResponse = ResponseStatus & ElevatorRequest

// export interface ElevatorTakingRequest {
//   elevatorName: string
//   destFloor: number
// }

// export type ElevatorTakingRequestResponse = ResponseStatus &
//   ElevatorTakingRequest
