/* eslint-disable node/no-callback-literal */
// I disabled `node/no-callback-literal` because the callback() below is not a nodejs callback function that expects to pass an error as the first parameter

import { Socket } from 'socket.io'
import { GameLoopManager } from '../gameLoops/GameLoopManager'
import { ClientCommands, OkOrError } from '../types/ElevatorAppTypes'

import { StateManager } from '../state/StateManager'

/**
  * This function defines listeners for the real-time messages sent by the clients
  * @param socket
  */
export const setClientActionListeners = (socket: Socket, gameLoopManager: GameLoopManager, stateManager: StateManager) : void => {
  //  using socket just to resolve the linter error
  console.log('socket.id', socket.id)

  socket.on(ClientCommands.SPAWN_NEW_PERSON, async (newPersonName, callback) => {
    //  limit the number of people who are in the "building" at a time
    if (stateManager.numPeople >= 3) {
      const newPersonSpawnedResponse = {
        status: OkOrError.Error,
        error: `Too many people are currently in the building, ${newPersonName} (sadly) was not able to be spawned`
      }

      callback(newPersonSpawnedResponse)
      return
    }

    const newPerson = await gameLoopManager.spawnNewPerson(newPersonName)

    if (!newPerson) { return }

    const newPersonSpawnedResponse = {
      status: OkOrError.Ok,
      personUpdate: newPerson.toJS()
    }

    callback(newPersonSpawnedResponse)
  })

  // socket.on(INCREASE_PEOPLE, (increaseBy, callback) => {
  //   addPeople(increaseBy)

  //   const numPeople = getNumPeople()

  //   const numPeopleUpdatedResponse: StatusUpdateResponse = {
  //     numPeople,
  //     status: OkOrError.Ok,
  //     message: `There are now ${numPeople} in the building`
  //   }

  //   callback(numPeopleUpdatedResponse)
  // })
}
