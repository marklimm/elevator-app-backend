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
  elevatorNames: string[]
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

export enum PersonUpdateType {
  NEWLY_SPAWNED = 'newly-spawned',
  REQUESTING_ELEVATOR = 'requesting-elevator',
  ENTERED_THE_ELEVATOR = 'entered-the-elevator',
  IN_THE_ELEVATOR = 'in-the-elevator',
  PRESSES_BUTTON = 'presses-button',
  LEFT_THE_ELEVATOR = 'left-the-elevator',
}

export enum ElevatorUpdateType {
  TAKING_REQUEST = 'taking-request',
  ON_FLOOR = 'on-floor',
  OPENING_DOORS = 'opening-doors',
  CLOSING_DOORS = 'closing-doors',
  MOVING_TO_FLOOR = 'moving-to-floor',
}

export type PersonUpdate = {
  type: PersonUpdateType

  person: PersonDTO
  elevator?: ElevatorDTO
  currFloor: number
  destFloor?: number
}

export type ElevatorUpdate = {
  type: ElevatorUpdateType

  people: PersonDTO[]
  elevator: ElevatorDTO
  currFloor: number
  destFloor?: number
}
