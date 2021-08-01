//  These types are only used on the server-side

export interface GameLoopIntervals {
  [key: string]: NodeJS.Timeout
}

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
