import { Server, Socket } from 'socket.io'
import { NewConnectionBuildingResponse, OkOrError } from './payloads/Building'

import { setClientActionListeners } from './ClientActions'
import { fluctuatingNumPeopleLoop, getMainLoop } from './GameLoops'
import { building } from './Building'

/**
 * The number of currently connected clients
 */
let numClients = 0

let gameLoopsAreRunning = false

/**
 * Contains the ids for all of the currently running game loops
 */
const intervalsArr: NodeJS.Timeout[] = []

const startGameLoops = (io: Server) => {
  //  fluctating number of people in the building
  intervalsArr.push(setInterval(fluctuatingNumPeopleLoop, 5000))

  //  "main" loop ... wondering if this will end up changing
  intervalsArr.push(setInterval(getMainLoop(io), 4000))
}

export const onNewConnection = (io: Server, socket: Socket) : void => {
  if (!gameLoopsAreRunning) {
    gameLoopsAreRunning = true

    startGameLoops(io)
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

export const onDisconnect = () : void => {
  //  this executes whenever a client disconnects

  numClients--
  console.log('a user has disconnected')

  if (numClients <= 0) {
    //  stop all the intervals/game loops since no more clients are connected

    //  clear all of the intervals/game loops
    intervalsArr.forEach(interval => clearInterval(interval))

    gameLoopsAreRunning = false
  }
}

export const setConnectionListeners = (io: Server, socket: Socket) : void => {
  onNewConnection(io, socket)

  socket.on('disconnect', onDisconnect)

  setClientActionListeners(socket)
}
