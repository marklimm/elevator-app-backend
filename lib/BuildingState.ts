import AsyncLock from 'async-lock'
import { Server as SocketIOServer } from 'socket.io'
import { ElevatorRequest } from './BuildingActions'
import { GameLoops } from './GameLoops'
import { getRandomFloor, getRandomName } from './Randomizer'

//  this is intended to be a shared state location where these variables can be referenced from anywhere within the application
//  then this module exports the variables so they are accessible from anywhere in the application

export const buildingDetails = {
  elevatorNames: ['Elevator A', 'Elevator B'],
  name: '1919 Sunset View',
  numFloors: 10,
  yearBuilt: 2005
}

// let { building, elevatorManager } = getInitialBuildingState(io)

export let gameLoops: GameLoops
// const isRunning = false

//  state
export const elevatorRequestQueue: ElevatorRequest[] = []
export let numPeople = 500

interface UserStatus {
  name: string,
  currFloor: number
  destFloor: number
}

interface UsersStatus {
  [key: string]: UserStatus
}

const usersStatus: UsersStatus = {}

const _lock = new AsyncLock()
const ELEVATOR_REQUEST_LOCK = 'elevator-request-lock'
const NUM_PEOPLE_LOCK = 'num-people-lock'

export const addElevatorRequest = async (elevatorRequest: ElevatorRequest) : Promise<void> => {
  await _lock.acquire(ELEVATOR_REQUEST_LOCK, () => {
    elevatorRequestQueue.push(elevatorRequest)
  })
}

export const removeElevatorRequest = async () : Promise<ElevatorRequest | null | undefined> => {
  if (elevatorRequestQueue.length === 0) { return null }

  const elevatorRequest = await _lock.acquire(ELEVATOR_REQUEST_LOCK, () => {
    return elevatorRequestQueue.shift()
  })

  return elevatorRequest
}

export const addPeople = async (increaseBy = 0) : Promise<void> => {
  await _lock.acquire(NUM_PEOPLE_LOCK, () => {
    numPeople += increaseBy
  })
}

export const removePeople = async (decreaseBy = 0) : Promise<void> => {
  await _lock.acquire(NUM_PEOPLE_LOCK, () => {
    numPeople -= decreaseBy
  })
}

//  users of elevators

export const getNumUsers = () : number => {
  return Object.keys(usersStatus).length
}

export const spawnNewUser = () : void => {
  const name = getRandomName()
  const currFloor = getRandomFloor(buildingDetails.numFloors)
  const destFloor = getRandomFloor(buildingDetails.numFloors, currFloor)

  console.log('{ name, currFloor, destFloor }', { name, currFloor, destFloor })

  //  add them to usersStatus
  usersStatus[name] = {
    name, currFloor, destFloor
  }

  console.log('after adding new user : userStatus', usersStatus)
}

export const getBroadcasterInformation = () : string => {
  const responseStrs = []

  responseStrs.push(`There are currently ${numPeople} in the building`)

  Object.keys(usersStatus).forEach(name => {
    const { currFloor, destFloor } = usersStatus[name]

    const str = `${name} is on the ${currFloor} and wants to get to the ${destFloor}`
    responseStrs.push(str)
  })

  return responseStrs.join('\n')
}

export const clientManager = {}

export const initializeGameLoops = (io: SocketIOServer) : void => {
  //  initialize the game loops but don't start them yet
  gameLoops = new GameLoops(io)
}
