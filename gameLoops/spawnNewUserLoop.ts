import { broadcastUserStatusUpdate } from '../state/Broadcaster'
import { getNumUsers, spawnNewUser } from '../state/People'

export const spawnNewUserLoop = async () : Promise<void> => {
  //  don't add more people if there's already one user
  if (getNumUsers() > 0) { return }

  const newUser = await spawnNewUser()

  //  broadcast that a new user has been created
  broadcastUserStatusUpdate([newUser])
}
