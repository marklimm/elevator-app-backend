
import { broadcastStatusUpdate } from '../state/Broadcaster'
import { usersMakeElevatorRequests } from '../state/People'
// import { UserStatus } from '../lib/BuildingActions'

export const personLoop = async () : Promise<void> => {
  const userWhoJustMadeRequest = await usersMakeElevatorRequests()

  if (userWhoJustMadeRequest) {
    //  broadcast that someone has just made an elevator request

    broadcastStatusUpdate()
  }
}
