//  these are types that are shared with the frontend.  These types have to do with payloads that get broadcasted to the clients

export enum OkOrError {
  Ok = 'ok',
  Error = 'error',
}

export interface ResponseStatus {
  error?: string
  message?: string
  status: OkOrError
}

export interface BuildingDetails {
  name: string
  numFloors: number
  yearBuilt: number
}

/**
 * This response is sent when a client first connects to the realtime server
 */
export type NewConnectionBuildingResponse = BuildingDetails &
  ResponseStatus

export interface ElevatorDTO {
  elevatorId: string
  name: string
}

export interface PersonDTO {
  personId: string
  name: string
}

export enum PersonStatus {
  NEWLY_SPAWNED = 'newly-spawned',
  WAITING_FOR_ELEVATOR = 'waiting-for-elevator',
  ENTERED_THE_ELEVATOR = 'entered-the-elevator',
  PRESSES_BUTTON = 'presses-button',
  IN_THE_ELEVATOR = 'in-the-elevator',
  LEFT_THE_ELEVATOR = 'left-the-elevator',
}

export enum ElevatorStatus {
  READY = 'ready',
  RECEIVED_REQUEST = 'received-request',
  DOORS_OPENING = 'doors-opening',
  DOORS_CLOSING = 'doors-closing',
  RECEIVED_DESTINATION = 'received-destination',
  MOVING_TO_FLOOR = 'moving-to-floor',
  INACTIVE = 'inactive',
}

export type PersonUpdate = {
  type: PersonStatus

  person: PersonDTO
  elevator?: ElevatorDTO
  currFloor: number
  destFloor?: number
}

export type ElevatorUpdate = {
  type: ElevatorStatus

  people: PersonDTO[]
  elevator: ElevatorDTO
  currFloor: number
  destFloor?: number
}
