import { Server, Socket } from 'socket.io'
import { getGameLoop } from './GameLoop'

/**
 * The number of currently connected clients
 */
let numClients = 0

let gameLoopInterval: NodeJS.Timeout
let gameLoopIsRunning = false

const startGameLoop = (io: Server) => {
  const gameLoopFunction = getGameLoop(io)
  return setInterval(gameLoopFunction, 4000)
}

export const onNewConnection = (io: Server, socket: Socket) : void => {
  if (!gameLoopIsRunning) {
    gameLoopIsRunning = true

    gameLoopInterval = startGameLoop(io)
  }

  numClients += 1
  console.log(`New user connected - there are now ${numClients} client(s) connected`)

  //  when a connection is made, send back the current state of the elevators
  socket.emit('newConnectionAck', {
    message: 'Thanks for connecting!  You will soon receive updates on the current buliding status'
  })
}

export const onDisconnect = () : void => {
  //  this executes whenever a client disconnects

  numClients--
  console.log('a user has disconnected')

  if (numClients <= 0) {
    //  stop the interval/game loop since no more clients are connected

    clearInterval(gameLoopInterval)
    gameLoopIsRunning = false
  }
}

/**
  * This function defines listeners for the real-time messages sent by the clients
  * @param socket
  */
export const setSocketListeners = (socket: Socket) : void => {

}
