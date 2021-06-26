//  I debated putting these types in separate files, however since these exact same types exist on both the client and server-side, it seems easier for me to just copy and paste this entire file.  I might change my mind on this later

//  client-initiated actions
export const INCREASE_PEOPLE = 'increase-people'
export const DECREASE_PEOPLE = 'decrease-people'
export const REQUEST_ELEVATOR = 'request-elevator'

//  server-initiated actions
export const ELEVATOR_STATUS = 'elevator-status'

export interface BuildingDetails {
  elevatorNames: string[]
  name: string
  numFloors: number
  yearBuilt: number
}

export interface BuildingStatus {
  numPeople: number
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

/**
 * This response is sent after the client has removed/added people to the building
 */
export type NumPeopleUpdatedResponse = BuildingStatus & ResponseStatus

/**
 * The request object for when the user requests that the elevator go to a destination floor
 */
export interface ElevatorRequest {
  destFloor: number
}

/**
 * The response sent after a user has requested that the elevator go to a destination floor
 */
export type ElevatorRequestResponse = ResponseStatus & ElevatorRequest

export interface ElevatorTakingRequest {
  elevatorName: string
  destFloor: number
}

export type ElevatorTakingRequestResponse = ResponseStatus &
  ElevatorTakingRequest
