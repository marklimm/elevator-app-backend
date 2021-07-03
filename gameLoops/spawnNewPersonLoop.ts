import { GameLoopIntervals } from '../lib/types/GameLoop'
import { broadcastNewPersonSpawned } from '../state/Broadcaster'
import { getNumPeople, spawnNewPerson } from '../state/People'
import { personLoop } from './personLoop'

export const spawnNewPersonLoop = async (intervalsObj: GameLoopIntervals) : Promise<void> => {
  //  don't add more people if there's already one user
  if (getNumPeople() > 1) { return }

  const newPerson = await spawnNewPerson()

  console.log(`${newPerson.name} was just spawned`)

  intervalsObj[`${newPerson.name}`] = setInterval(personLoop.bind(null, newPerson.name), 5000)

  //  broadcast that a new person has been created
  // broadcastPersonStatusUpdate(newPerson)
  broadcastNewPersonSpawned(newPerson)
}
