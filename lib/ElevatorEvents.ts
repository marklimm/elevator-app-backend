export interface ElevatorDTO {
  elevatorId: string
  name: string
}

export interface UserDTO {
  userId: string
  name: string
}

export enum UserUpdateType {
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

export type UserUpdate = {
  type: UserUpdateType

  user: UserDTO
  elevator?: ElevatorDTO
  currFloor: number
}

export type ElevatorUpdate = {
  type: ElevatorUpdateType

  user: UserDTO[]
  elevator: ElevatorDTO
  currFloor: number
}
