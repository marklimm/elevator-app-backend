import { Socket } from 'socket.io'
import AsyncLock from 'async-lock'

const NUM_PEOPLE_LOCK = 'num-people-lock'

const lock = new AsyncLock()

/**
  * This function defines listeners for the real-time messages sent by the clients
  * @param socket
  */
export const setClientListeners = (socket: Socket) : void => {
  socket.on('increase-people', () => {

  })

  socket.on('decrease-people', () => {

  })
}
