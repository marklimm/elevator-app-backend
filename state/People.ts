import AsyncLock from 'async-lock'
import { getRandomFloor, getRandomName } from '../lib/Randomizer'
import { buildingDetails } from './Building'
import { User, Users, UserStatus } from '../lib/BuildingActions'
import { addElevatorRequest } from './Elevators'

let numPeople = 500

//  maybe it's worth converting this to a class so that we can get private variables ... so that you can't modify usersStatus from outside of the class
let users: Users = {}

const _lock = new AsyncLock()

const NUM_PEOPLE_LOCK = 'num-people-lock'

const USERS_LOCK = 'users-lock'

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

export const getUsers = () : Users => {
  return users
}

export const getUsersAsArray = () : User[] => {
  return Object.keys(users).map(name => {
    return users[name]
  })
}

//  users of elevators

export const getNumUsers = () : number => {
  return Object.keys(users).length
}

export const resetUsers = () : void => {
  users = {}
}

export const spawnNewUser = async () : Promise<User> => {
  const name = getRandomName()
  const currFloor = getRandomFloor(buildingDetails.numFloors)
  const destFloor = getRandomFloor(buildingDetails.numFloors, currFloor)

  await _lock.acquire(USERS_LOCK, () => {
  //  add them to users
    users[name] = {
      name, currFloor, destFloor, status: UserStatus.NEWLY_SPAWNED
    }
  })

  console.log('after adding new user : users', users)

  return users[name]
}

const makeElevatorRequests = async (usersMakingElevatorRequests: User[]) => {
  for (const user of usersMakingElevatorRequests) {
    console.log(`${user.name} is making a request to go to ${user.destFloor}`)
    await addElevatorRequest({ destFloor: user.destFloor })

    //  specify that the user is now waiting for the elevator
    user.status = UserStatus.WAITING_ON_ELEVATOR
  }
}

export const usersMakeElevatorRequests = async () : Promise<User[]> => {
  const usersArr: User[] = getUsersAsArray()

  //  check if any users are calling the elevator
  const usersMakingElevatorRequests = usersArr.filter(user => user.status === UserStatus.NEWLY_SPAWNED)

  await makeElevatorRequests(usersMakingElevatorRequests)

  return usersMakingElevatorRequests
}
