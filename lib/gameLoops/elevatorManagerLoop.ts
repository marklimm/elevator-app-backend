import { StateManager } from '../state/StateManager'

/**
 * This elevatorManagerLoop reads from the elevator requests array and finds an elevator to take that request
 * @param elevator
 * @param lock
 */
export const elevatorManagerLoop = async (stateManager: StateManager) : Promise<void> => {
  await stateManager.findElevatorToTakeRequest()
}
