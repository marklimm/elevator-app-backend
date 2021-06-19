/* eslint-disable node/no-callback-literal */
// I disabled `node/no-callback-literal` because the callback() below is not a nodejs callback function that expects to pass an error as the first parameter

import { Socket } from 'socket.io'

import { building } from './Building'

/**
  * This function defines listeners for the real-time messages sent by the clients
  * @param socket
  */
export const setClientActionListeners = (socket: Socket) : void => {
  socket.on('increase-people', (increaseBy, callback) => {
    building.addPeople(increaseBy)

    callback({
      status: 'completed'
    })
  })

  socket.on('decrease-people', (decreaseBy, callback) => {
    building.removePeople(decreaseBy)

    callback({
      status: 'completed'
    })
  })
}
