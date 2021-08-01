import { Elevator } from './Elevator'
import { ElevatorStatus } from '../types/ElevatorAppTypes'

export class Elevators {
  private _elevators: Elevator[]

  public static ELEVATORS_LOCK = 'elevators-lock'

  constructor () {
    this._elevators = [
      new Elevator('Elevator A'),
      new Elevator('Elevator B')
    ]
  }

  public get elevators () : Elevator[] {
    return this._elevators
  }

  /**
   * Reset to the default initial setup of elevators within the building
   */
  public reset () : void {
    this._elevators = [
      new Elevator('Elevator A'),
      new Elevator('Elevator B')
    ]
  }

  // public getElevatorPickingUpPerson = (personOnFloor: number) : Elevator | undefined => {
  //   // const elevatorPickingUpPerson = await this._lock.acquire(Elevators.ELEVATORS_LOCK, () => {
  //   return this._elevators.find(elevator => elevator.currFloor === personOnFloor && elevator.status === ElevatorStatus.DOORS_OPENING)
  //   // })

  //   // return elevatorPickingUpPerson
  // }

  private getClosestReadyElevator (destFloor : number) : Elevator | null {
    const readyElevators = this._elevators.filter(elevator => {
      return elevator.status === ElevatorStatus.READY
    })

    if (readyElevators.length === 0) { return null }

    //  arbitrarily high value
    let closestFloorDistance = 1000
    let closestReadyElevator = readyElevators[0]

    readyElevators.forEach(elevator => {
      const floorDistance = Math.abs(destFloor - elevator.currFloor)

      // console.log(`${elevator.name} on ${elevator.currFloor} is ${floorDistance} away from ${destFloor}`)

      if (floorDistance < closestFloorDistance) {
        closestFloorDistance = floorDistance
        closestReadyElevator = elevator
      }
    })

    return closestReadyElevator
  }

  public chooseElevator (destFloor: number) : Elevator | null {
    // console.log('-- chooseElevator START --')
    // const elevatorsArr = getElevatorsAsArray()

    //  use Object.values() instead?
    // Object.values(elevators)

    //  is there already an elevator that is heading in the direction of the requested floor?
    // const elevatorHeadingTowardsRequestAlready = elevatorsArr.find(elevator => elevatorHeadingTowardsFloor(elevator, elevatorRequest)
    // )

    // console.log('elevatorHeadingTowardsRequestAlready', elevatorHeadingTowardsRequestAlready)

    // if (elevatorHeadingTowardsRequestAlready) { return elevatorHeadingTowardsRequestAlready }

    //  what is the closest "Ready" elevator to the destFloor?
    const closestReadyElevator = this.getClosestReadyElevator(destFloor)

    // console.log('closestReadyElevator', closestReadyElevator)
    // console.log('-- chooseElevator END --')
    return closestReadyElevator
  }
}
