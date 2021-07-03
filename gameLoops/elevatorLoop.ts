
import { broadcastElevatorMoving, broadcastElevatorOpensDoors } from '../state/Broadcaster'
import { elevatorMoves, elevatorOpensDoors, elevators, elevatorShouldOpenDoors } from '../state/Elevators'
import { Elevator, ElevatorStatus } from '../lib/types/Elevator'

export const elevatorLoop = async ({ name }: Elevator) : Promise<void> => {
  const cantOpenDoorsStatuses = [ElevatorStatus.INACTIVE, ElevatorStatus.DOORS_CLOSING, ElevatorStatus.DOORS_OPENING]

  const elevator = elevators[name]
  // console.log(`elevator loop for ${elevator.name}`)

  //  exit this function if the elevator shouldn't open its doors
  if (cantOpenDoorsStatuses.indexOf(elevator.status) > -1) {
    // console.log('exiting because elevator.status', elevator.status)
    return
  }

  if (elevatorShouldOpenDoors(elevator)) {
    //  elevator has reached its destination, open the doors

    await elevatorOpensDoors(elevator)

    broadcastElevatorOpensDoors(elevator)

    return
  }

  if (elevator.status === ElevatorStatus.MOVING) {
    await elevatorMoves(elevator)

    broadcastElevatorMoving(elevator)
  }

  //  the ElevatorStatus.READY status is handled by the elevatorManagerLoop
}
