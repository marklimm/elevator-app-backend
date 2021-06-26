import { Direction, Elevator, ElevatorStatus } from '../lib/BuildingActions'
import { broadcastUserStatusUpdate } from '../state/Broadcaster'
import { usersMakeElevatorRequests } from '../state/People'

export const elevatorLoop = async (elevator: Elevator) : Promise<void> => {
  console.log(`elevator loop - ${new Date()}`)
  const cantOpenDoorsStatuses = [ElevatorStatus.INACTIVE, ElevatorStatus.DOORS_CLOSING, ElevatorStatus.DOORS_OPENING]

  //  exit this function if the elevator shouldn't open its doors
  if (cantOpenDoorsStatuses.indexOf(elevator.status) > -1) { return }

  if (elevator.status === ElevatorStatus.MOVING && elevator.currFloor === elevator.destFloor) {
    //  should open doors I'm thinking

    elevator.status = ElevatorStatus.DOORS_OPENING

    return
  }

  if (elevator.status === ElevatorStatus.MOVING) {
    elevator.direction === Direction.GOING_UP ? elevator.currFloor += 1 : elevator.currFloor -= 1
  }

  // const usersWhoJustMadeAnElevatorRequest = await usersMakeElevatorRequests()

  // if (usersWhoJustMadeAnElevatorRequest.length > 0) {
  //   //  broadcast that at least one person has just made an elevator request

  //   console.log('usersWhoJustMadeAnElevatorRequest', usersWhoJustMadeAnElevatorRequest)

  //   broadcastUserStatusUpdate(usersWhoJustMadeAnElevatorRequest)
  // }
}
