import { Direction, ElevatorStatus, ElevatorUpdate } from '../types/ElevatorAppTypes'
import { ElevatorRequest } from '../types/ServerSideTypes'
import { Person } from './Person'

export class Elevator {
  private _currFloor: number
  private _destFloor: number

  /**
   * The Direction this elevator will have (and be committed to --> will not change) once the elevator has picked up its first passenger.  This value can only be changed when the elevator has no passengers and is in READY status
   */
  private _committedDirection: Direction

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

    this._committedDirection = Direction.NONE
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

  public get committedDirection () : Direction {
    return this._committedDirection
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

  /**
   * This method converts the Elevator into the JSON type that gets broadcasted to the client
   * @returns
   */
  public toJS () : ElevatorUpdate {
    return {
      type: this._status,
      timestamp: Date.now(),

      elevator: {
        currFloor: this.currFloor,
        destFloor: this.destFloor,
        direction: this.direction,
        committedDirection: this.committedDirection,
        name: this.name
      },

      people: this._people.map(person => ({
        currFloor: person.currFloor,
        destFloor: person.destFloor,
        direction: person.direction,
        name: person.name
      }))

    }
  }

  public doorsClosed () : void {
    this._status = ElevatorStatus.DOORS_CLOSED
  }

  public doorsClosing () : void {
    this._status = ElevatorStatus.DOORS_CLOSING
  }

  public doorsOpening () : void {
    this._status = ElevatorStatus.DOORS_OPENING

    //  the elevator doesn't know yet which floor the user wants to go to, but the elevator does know which direction they want to go.  Set a max or min value for destFloor which will update the `direction` value.  This tells the "lights on top of the elevator doors" whether to point UP or DOWN
    this._destFloor = this._committedDirection === Direction.DOWN ? 0 : Number.MAX_SAFE_INTEGER

    //  this._committedDirection is already set from when the elevator was first requested by the user
  }

  public doorsOpen () : void {
    this._status = ElevatorStatus.DOORS_OPEN
  }

  public elevatorHeadingTowardsFloor (elevatorRequest: ElevatorRequest) : boolean {
    return this._currFloor <= elevatorRequest.destFloor && elevatorRequest.destFloor <= this._destFloor
  }

  public movesToFloor () : void {
    this.direction === Direction.UP ? this._currFloor += 1 : this._currFloor -= 1
  }

  public readyToTakeNewRequest () : void {
    this._status = ElevatorStatus.READY
    this._committedDirection = Direction.NONE
  }

  public receivedDestination (destFloor = 1) : void {
    this._status = ElevatorStatus.RECEIVED_DESTINATION
    this._destFloor = destFloor
  }

  public releasesPerson (personWhoLeft: Person) : void {
    this._people = this.people.filter(person => person.name !== personWhoLeft.name)
  }

  public shouldStopAndOpenDoors () : boolean {
    return this._currFloor === this._destFloor && this._status === ElevatorStatus.MOVING_TO_FLOOR
  }

  public startMoving () : void {
    this._status = ElevatorStatus.MOVING_TO_FLOOR
  }

  public takeRequest (elevatorRequest: ElevatorRequest) : void {
    //  I feel like there would be more complicated logic if an elevator is stopping mid-way to also answer a new request that is going in the same direction that the elevator is already going

    this._destFloor = elevatorRequest.destFloor
    this._committedDirection = elevatorRequest.direction
    this._status = ElevatorStatus.TOOK_REQUEST
  }

  public takesPerson (person: Person) : void {
    this.people.push(person)
  }
}
