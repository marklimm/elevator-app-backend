export enum PersonStatus {
  NEWLY_SPAWNED = 'newly-spawned',
  WAITING_FOR_ELEVATOR = 'waiting-for-elevator',
  PRESSES_BUTTON = 'presses-button',
  IN_ELEVATOR = 'in-elevator',
  AT_DESTINATION = 'at-destination'
}

export interface Person {
  name: string,
  currFloor: number
  destFloor: number
  status: PersonStatus
}

export interface People {
  [key: string]: Person
}
