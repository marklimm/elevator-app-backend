import { GameLoopIntervals } from '../lib/BuildingActions'
import { broadcastUserStatusUpdate } from '../state/Broadcaster'
import { getNumUsers, spawnNewUser } from '../state/People'
import { personLoop } from './personLoop'

export const spawnNewUserLoop = async (intervalsObj: GameLoopIntervals) : Promise<void> => {
  //  don't add more people if there's already one user
  if (getNumUsers() > 1) { return }

  const newUser = await spawnNewUser()

  console.log(`${newUser} was just spawned`)
  // intervalsArr.push(setInterval(personLoop.bind(null, newUser.name), 5000))
  // setInterval(elevatorManagerLoop.bind(this), 4000)

  intervalsObj[`${newUser.name}`] = setInterval(personLoop.bind(null, newUser.name), 5000)

  //  broadcast that a new user has been created
  broadcastUserStatusUpdate(newUser)
}
