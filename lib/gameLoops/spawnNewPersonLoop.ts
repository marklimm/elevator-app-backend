import { GameLoopIntervals } from '../types/types'

import { personLoop } from './personLoop'
import { StateManager } from '../state/StateManager'
import AsyncLock from 'async-lock'
import { PersonBroadcaster } from '../broadcasters/PersonBroadcaster'

/**
 * This loop spawns new people on an interval
 * @param intervalsObj
 * @param stateManager
 * @param lock
 * @returns
 */
export const spawnNewPersonLoop = async (intervalsObj: GameLoopIntervals, stateManager: StateManager, personBroadcaster: PersonBroadcaster, lock: AsyncLock) : Promise<void> => {
  const newPerson = await stateManager.addToPeople()

  if (!newPerson) { return }

  intervalsObj[`${newPerson.name}`] = setInterval(personLoop.bind(null, newPerson, stateManager, personBroadcaster, lock), 5000)

  //  broadcast that a new person has been created
  personBroadcaster.broadcastNewPersonSpawned(newPerson)
}
