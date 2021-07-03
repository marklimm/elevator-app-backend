
import { handleElevatorRequest } from '../state/Elevators'
// import { broadcastElevatorStatusUpdate } from '../state/Broadcaster'

export const elevatorManagerLoop = async () : Promise<void> => {
  // const elevatorsArr = getElevatorsAsArray()

  const elevatorTakingRequest = await handleElevatorRequest()

  if (elevatorTakingRequest) {
    // broadcastElevatorStatusUpdate(elevatorTakingRequest)
  }
}
