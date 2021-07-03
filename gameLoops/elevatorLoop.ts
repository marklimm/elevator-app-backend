import { Elevator, ElevatorStatus } from '../lib/BuildingActions'
import { broadcastElevatorMoving, broadcastElevatorOpensDoors } from '../state/Broadcaster'
import { elevatorMoves, elevatorOpensDoors, elevators } from '../state/Elevators'

export const elevatorLoop = async ({ name }: Elevator) : Promise<void> => {
  const cantOpenDoorsStatuses = [ElevatorStatus.INACTIVE, ElevatorStatus.DOORS_CLOSING, ElevatorStatus.DOORS_OPENING]

  const elevator = elevators[name]
  // console.log(`elevator loop for ${elevator.name}`)

  //  exit this function if the elevator shouldn't open its doors
  if (cantOpenDoorsStatuses.indexOf(elevator.status) > -1) {
    // console.log('exiting because elevator.status', elevator.status)
    return
  }

  if (elevator.status === ElevatorStatus.MOVING && elevator.currFloor === elevator.destFloor) {
    //  elevator has reached its destination, open the doors

    console.log('opening doors')
    await elevatorOpensDoors(elevator)

    broadcastElevatorOpensDoors(elevator)

    return
  }

  if (elevator.status === ElevatorStatus.MOVING) {
    await elevatorMoves(elevator)

    console.log(`elevator has moved - ${new Date()}`)

    broadcastElevatorMoving(elevator)
  }

  //  the ElevatorStatus.READY status is handled by the elevatorManagerLoop
}
