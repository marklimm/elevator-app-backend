import { GameLoopIntervals } from '../types/types'

import { personBroadcaster } from '../socketIOSetup'

import { personLoop } from './personLoop'
import { StateManager } from '../StateManager'
import AsyncLock from 'async-lock'

export const spawnNewPersonLoop = async (intervalsObj: GameLoopIntervals, stateManager: StateManager, lock: AsyncLock) : Promise<void> => {
  const newPerson = await stateManager.addToPeople()

  if (!newPerson) { return }

  intervalsObj[`${newPerson.name}`] = setInterval(personLoop.bind(null, newPerson, stateManager, lock), 5000)

  //  broadcast that a new person has been created
  personBroadcaster.broadcastNewPersonSpawned(newPerson)
}
