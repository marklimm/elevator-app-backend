//  The types in this file define a shared "contract" between the frontend and backend.  These types are the statuses and payloads that get broadcasted from the server to the clients.
//  This file is identical on both the frontend and backend

/**
 * A type representing information on the Building itself
 */
export interface Building {
  name: string
  numFloors: number
  yearBuilt: number
}

export enum Direction {
  DOWN = 'down',

  /**
   * Direction is "none" when an elevator's current floor is its destination floor and does not have a request to move
   */
  NONE = 'none',

  UP = 'up',
}

//  -----------------------------
//  Person and Elevator status types

export enum PersonStatus {
  NEWLY_SPAWNED = 'newly-spawned',
  REQUESTED_ELEVATOR = 'requested-elevator',
  ENTERED_THE_ELEVATOR = 'entered-the-elevator',
  PRESSED_BUTTON = 'pressed-button',
  IN_THE_ELEVATOR = 'in-the-elevator',
  LEFT_THE_ELEVATOR = 'left-the-elevator',
  UNSPAWNED = 'unspawned',
}

export enum ElevatorStatus {
  READY = 'ready',
  TOOK_REQUEST = 'took-request',
  MOVING_TO_FLOOR = 'moving-to-floor',

  DOORS_OPENING = 'doors-opening',
  DOORS_OPEN = 'doors-open',
  RECEIVED_DESTINATION = 'received-destination',
  DOORS_CLOSING = 'doors-closing',
  DOORS_CLOSED = 'doors-closed',

  INACTIVE = 'inactive',
}

//  -----------------------------
//  Person and Elevator update types

interface CommonFields {
  currFloor: number
  destFloor: number
  direction: Direction

  //  committedDirection only applies to elevators.  It is the direction that the elevator will go once it has received a passenger
  committedDirection?: Direction

  name: string
}

export type PersonUpdate = {
  type: PersonStatus
  timestamp: number

  person: CommonFields
  elevator?: CommonFields
}

export type ElevatorUpdate = {
  type: ElevatorStatus
  timestamp: number

  elevator: CommonFields
  people?: CommonFields[]
}

//  -----------------------------
//  Commands that are initiated by the client and sent to the server

export enum ClientCommands {
  SPAWN_NEW_PERSON = 'spawn-new-person',
}

//  -----------------------------
//  Response status types

export enum OkOrError {
  Ok = 'ok',
  Error = 'error',
}

export interface ResponseStatus {
  error?: string
  message?: string
  status: OkOrError
}

//  -----------------------------
//  Response types that get sent from server to client

/**
 * This response is sent when a client first connects to the realtime server
 */
export type NewConnectionBuildingResponse = ResponseStatus & {
  building: Building
}

/**
 * A server-to-client broadcast when a person's status has changed
 */
export type PersonUpdateResponse = ResponseStatus & {
  personUpdate: PersonUpdate
}

/**
 * A server-to-client broadcast when an elevator's status has changed
 */
export type ElevatorUpdateResponse = ResponseStatus & {
  elevatorUpdate: ElevatorUpdate
}
