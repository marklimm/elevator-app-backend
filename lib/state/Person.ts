import { Direction, ElevatorStatus, PersonStatus, PersonUpdate } from '../types/ElevatorAppTypes'
import { Elevator } from './Elevator'

export class Person {
  private _currFloor: number
  private _destFloor: number
  private _name: string
  private _status: PersonStatus

  private _elevator: Elevator | null

  private static PERSON_LOCK = 'person-lock'

  constructor (name = 'Unnamed Person', currFloor = 1, destFloor = 2) {
    this._name = name
    this._currFloor = currFloor
    this._destFloor = destFloor

    this._status = PersonStatus.NEWLY_SPAWNED

    this._elevator = null
  }

  /**
   * The name of a lock specifically for this person
   */
  public get lockName () : string {
    return `${Person.PERSON_LOCK}-${this._name}`
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

  public get elevator () : Elevator | null {
    return this._elevator
  }

  public get status () : PersonStatus {
    return this._status
  }

  /**
   * This method converts the Person into the JSON type that gets broadcasted to the client
   * @returns
   */
  public toJS () : PersonUpdate {
    return {
      type: this._status,
      person: {
        currFloor: this._currFloor,
        destFloor: this._destFloor,
        direction: this.direction,
        name: this._name

      },

      elevator: !this._elevator
        ? undefined
        : {
            currFloor: this._elevator.currFloor,
            destFloor: this._elevator.destFloor,
            direction: this._elevator.direction,
            name: this._elevator.name
          }
    }
  }

  public entersElevator (elevator: Elevator) : void {
    this._status = PersonStatus.ENTERED_THE_ELEVATOR
    this._elevator = elevator
  }

  public leavesElevator () : void {
    this._status = PersonStatus.LEFT_THE_ELEVATOR
    this._elevator = null
  }

  public pressesButton () : void {
    this._status = PersonStatus.PRESSED_BUTTON
  }

  public removeFromApp () : void {
    this._status = PersonStatus.REMOVED_FROM_APP
  }

  public requestsElevator () : void {
    this._status = PersonStatus.REQUESTED_ELEVATOR
  }

  public shouldLeaveElevator () : boolean {
    return !!this._elevator && this._elevator.status === ElevatorStatus.DOORS_OPEN && this._destFloor === this._elevator.currFloor
  }
}
