import { ElevatorStatus } from '../types/EventPayloads'
import { Direction, ElevatorRequest } from '../types/types'
import { Person } from './Person'

export class Elevator {
  private _currFloor: number
  private _destFloor: number
  private _name: string
  private _people: Person[]
  private _status: ElevatorStatus

  private static ELEVATOR_LOCK = 'elevator-lock'

  constructor (name = 'Unnamed Elevator') {
    this._currFloor = 1
    this._destFloor = 1
    this._name = name
    this._people = []
    this._status = ElevatorStatus.READY
  }

  /**
   * The name of a lock specifically for this elevator
   */
  public get lockName () : string {
    return `${Elevator.ELEVATOR_LOCK}-${this._name}`
  }

  public get name () : string {
    return this._name
  }

  public get direction () : Direction {
    return this._currFloor > this._destFloor ? Direction.GOING_DOWN : Direction.GOING_UP
  }

  public get currFloor () : number {
    return this._currFloor
  }

  public get destFloor () : number {
    return this._destFloor
  }

  public get people () : Person[] {
    return this._people
  }

  public get status () : ElevatorStatus {
    return this._status
  }

  public elevatorHeadingTowardsFloor (elevatorRequest: ElevatorRequest) : boolean {
    return this._currFloor <= elevatorRequest.destFloor && elevatorRequest.destFloor <= this._destFloor
  }

  public shouldOpenDoors () : boolean {
    return this._currFloor === this._destFloor && this._status === ElevatorStatus.MOVING_TO_FLOOR
  }

  public movesToFloor () : void {
    this.direction === Direction.GOING_UP ? this._currFloor += 1 : this._currFloor -= 1
  }

  public openDoors () : void {
    this._status = ElevatorStatus.DOORS_OPENING
  }

  public takeRequest (elevatorRequest: ElevatorRequest) : void {
    //  I feel like there would be more complicated logic if an elevator is stopping mid-way to also answer a new request that is going in the same direction that the elevator is already going

    this._destFloor = elevatorRequest.destFloor
    this._status = ElevatorStatus.TOOK_REQUEST
  }

  public startMoving () : void {
    this._status = ElevatorStatus.MOVING_TO_FLOOR
  }

  // public elevatorGetsRiderAndDestination (person: Person) : void {
  //   this._status = ElevatorStatus.MOVING_TO_FLOOR
  //   this._destFloor = person.destFloor
  //   this._people = [
  //     ...this._people,
  //     person
  //   ]
  // }
}
