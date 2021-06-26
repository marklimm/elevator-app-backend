import AsyncLock from 'async-lock'
import { getRandomFloor, getRandomName } from '../lib/Randomizer'
import { buildingDetails } from './Building'
import { UsersStatus } from '../lib/BuildingActions'

let numPeople = 500

const usersStatus: UsersStatus = {}

const _lock = new AsyncLock()

const NUM_PEOPLE_LOCK = 'num-people-lock'

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

export const getNumPeople = () : number => {
  return numPeople
}

export const getUsersStatus = () : UsersStatus => {
  return usersStatus
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
