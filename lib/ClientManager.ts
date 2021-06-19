import { Socket } from 'socket.io'
import { NewConnectionBuildingResponse, OkOrError } from './BuildingActions'

import { setClientActionListeners } from './BuildingActionListeners'
import { GameLoops } from './GameLoops'
import { building } from './Building'

/**
 * The number of currently connected clients
 */
let numClients = 0

export const onNewConnection = (gameLoops: GameLoops, socket: Socket) : void => {
  if (!gameLoops.areRunning()) {
    //  the first client to connect will start the game loops
    gameLoops.startGameLoops()
  }

  numClients += 1
  console.log(`New user connected - there are now ${numClients} client(s) connected`)

  const staticStats = building.getStaticStats()
  const numPeople = building.getNumPeople()

  const newConnectionResponse: NewConnectionBuildingResponse = {
    ...staticStats,
    numPeople,
    status: OkOrError.Ok,
    message: 'Successfully connected!'
  }

  //  when a connection is made, send back the current state of the elevators
  socket.emit('newConnectionAck', newConnectionResponse)
}

export const onDisconnect = (gameLoops: GameLoops) : void => {
  //  this executes whenever a client disconnects

  numClients--
  console.log('a user has disconnected')

  if (numClients <= 0) {
    //  stop all the intervals/game loops since no more clients are connected

    gameLoops.stopGameLoops()
  }
}

export const setConnectionListeners = (gameLoops: GameLoops, socket: Socket) : void => {
  onNewConnection(gameLoops, socket)

  socket.on('disconnect', onDisconnect.bind(this, gameLoops))

  setClientActionListeners(socket)
}
