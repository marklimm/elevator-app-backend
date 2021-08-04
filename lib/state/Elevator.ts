import { Direction, ElevatorStatus } from '../types/ElevatorAppTypes'
import { ElevatorRequest } from '../types/ServerSideTypes'
import { Person } from './Person'

export class Elevator {
  private _currFloor: number
  private _destFloor: number

  /**
   * The Direction this elevator will have once it reaches its destination
   */
  private _futureDirection: Direction

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

    this._futureDirection = Direction.NONE
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
    if (this._currFloor === this._destFloor) { return Direction.NONE }

    return this._currFloor > this._destFloor ? Direction.DOWN : Direction.UP
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
    this.direction === Direction.UP ? this._currFloor += 1 : this._currFloor -= 1
  }

  public doorsOpening () : void {
    this._status = ElevatorStatus.DOORS_OPENING

    //  the elevator doesn't know yet which floor the user wants to go to, but the elevator does know which direction they want to go.  Set a max or min value for destFloor which will update the `direction` value.  This tells the "lights on top of the elevator doors" whether to point UP or DOWN
    this._destFloor = this._futureDirection === Direction.DOWN ? 0 : Number.MAX_SAFE_INTEGER

    //  clear out futureDirection since we've "copied over" that direction to the elevator
    this._futureDirection = Direction.NONE
  }

  public doorsOpen () : void {
    this._status = ElevatorStatus.DOORS_OPEN
  }

  public takeRequest (elevatorRequest: ElevatorRequest) : void {
    //  I feel like there would be more complicated logic if an elevator is stopping mid-way to also answer a new request that is going in the same direction that the elevator is already going

    this._destFloor = elevatorRequest.destFloor
    this._futureDirection = elevatorRequest.direction
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
