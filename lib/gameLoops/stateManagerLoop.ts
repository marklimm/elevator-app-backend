import { StateManager } from '../StateManager'

export const stateManagerLoop = async (stateManager: StateManager) : Promise<void> => {
  await stateManager.findElevatorToTakeRequest()

  // if (elevatorTakingRequest) {
  //   elevatorBroadcaster.broadcastElevatorTakingRequest(elevatorTakingRequest)
  // }
}
