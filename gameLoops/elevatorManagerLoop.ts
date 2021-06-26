import { Direction, ElevatorStatus } from '../lib/BuildingActions'
import { elevatorTakesRequest, getElevatorsAsArray } from '../state/Elevators'

export const elevatorManagerLoop = async () : Promise<void> => {
  const elevatorsArr = getElevatorsAsArray()

  //  as an initial test, just start the elevators and have them go to floor 10
  for (const elevator of elevatorsArr) {
    //  test code, just make the elevators go to the 10th floor and then have them stop
    if (elevator.currFloor === 10) { return }

    //  below is the code to have an elevator take a request
    if (elevator.status !== ElevatorStatus.MOVING) {
      elevatorTakesRequest(elevator, { fromFloor: 10, direction: Direction.GOING_DOWN })
    }
  }
}
