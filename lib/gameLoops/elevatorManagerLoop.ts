import { StateManager } from '../StateManager'

//  this loop manages/works across multiple elevators

export const elevatorManagerLoop = async (stateManager: StateManager) : Promise<void> => {
  await stateManager.findElevatorToTakeRequest()
}
