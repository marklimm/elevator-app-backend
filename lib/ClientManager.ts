import { Socket } from 'socket.io'
import { NewConnectionBuildingResponse, OkOrError } from './BuildingActions'

import { gameLoopManager } from '../state/GameLoops'
import { buildingDetails } from '../state/Building'
import { resetUsers } from '../state/People'

/**
 * The number of currently connected clients
 */
let numClients = 0

export const onNewConnection = (socket: Socket) : void => {
  if (!gameLoopManager.areRunning) {
    //  the first client to connect will start the game loops
    gameLoopManager.start()
  }

  numClients += 1
  console.log(`New user connected - there are now ${numClients} client(s) connected`)

  const newConnectionResponse: NewConnectionBuildingResponse = {
    ...buildingDetails,
    status: OkOrError.Ok,
    message: 'Successfully connected!'
  }

  //  when a connection is made, send back the current state of the elevators
  socket.emit('newConnectionAck', newConnectionResponse)
}

export const onDisconnect = () : void => {
  //  this executes whenever a client disconnects

  numClients--
  console.log('a user has disconnected')

  if (numClients <= 0) {
    //  stop all the intervals/game loops since no more clients are connected

    gameLoopManager.stop()

    resetUsers()
  }
}

export const setConnectionListeners = (socket: Socket) : void => {
  onNewConnection(socket)

  socket.on('disconnect', onDisconnect.bind(this))
}
