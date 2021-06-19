/* eslint-disable node/no-callback-literal */
// I disabled `node/no-callback-literal` because the callback() below is not a nodejs callback function that expects to pass an error as the first parameter

import { Socket } from 'socket.io'

import { DECREASE_PEOPLE, ElevatorRequestResponse, INCREASE_PEOPLE, NumPeopleUpdatedResponse, OkOrError, REQUEST_ELEVATOR } from './BuildingActions'
import { building } from './Building'

/**
  * This function defines listeners for the real-time messages sent by the clients
  * @param socket
  */
export const setClientActionListeners = (socket: Socket) : void => {
  socket.on(REQUEST_ELEVATOR, (destFloor, callback) => {
    building.addElevatorRequest({ destFloor })

    const elevatorRequestResponse: ElevatorRequestResponse = {
      destFloor,
      status: OkOrError.Ok,
      message: `We have received your request to go to floor ${destFloor}.  An elevator will be with you shortly!`
    }

    callback(elevatorRequestResponse)
  })

  socket.on(INCREASE_PEOPLE, (increaseBy, callback) => {
    building.addPeople(increaseBy)

    const numPeopleUpdatedResponse: NumPeopleUpdatedResponse = {
      numPeople: building.getNumPeople(),
      status: OkOrError.Ok,
      message: `There are now ${building.getNumPeople()} in the building`
    }

    callback(numPeopleUpdatedResponse)
  })

  socket.on(DECREASE_PEOPLE, (decreaseBy, callback) => {
    building.removePeople(decreaseBy)

    const numPeopleUpdatedResponse: NumPeopleUpdatedResponse = {
      numPeople: building.getNumPeople(),
      status: OkOrError.Ok,
      message: `There are now ${building.getNumPeople()} in the building`
    }

    callback(numPeopleUpdatedResponse)
  })
}
