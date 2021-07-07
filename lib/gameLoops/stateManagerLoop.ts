import { StateManager } from '../StateManager'
import { elevatorBroadcaster } from '../socketIOSetup'

export const stateManagerLoop = async (stateManager: StateManager) : Promise<void> => {
  const elevatorTakingRequest = await stateManager.findElevatorToTakeRequest()

  if (elevatorTakingRequest) {
    elevatorBroadcaster.broadcastElevatorTakingRequest(elevatorTakingRequest)
  }
}
