
import { broadcastUserStatusUpdate } from '../state/Broadcaster'
import { usersMakeElevatorRequests } from '../state/People'

export const personLoop = async () : Promise<void> => {
  const usersWhoJustMadeAnElevatorRequest = await usersMakeElevatorRequests()

  if (usersWhoJustMadeAnElevatorRequest.length > 0) {
    //  broadcast that at least one person has just made an elevator request

    console.log('usersWhoJustMadeAnElevatorRequest', usersWhoJustMadeAnElevatorRequest)

    broadcastUserStatusUpdate(usersWhoJustMadeAnElevatorRequest)
  }
}
