import AsyncLock from 'async-lock'
import { getRandomFloor, getRandomName } from '../lib/Randomizer'
import { buildingDetails } from './Building'
import { Direction, User, Users, UserStatus } from '../lib/BuildingActions'
import { addElevatorRequest } from './Elevators'
import { broadcastUserStatusUpdate } from './Broadcaster'

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
  const name = getRandomName(getUsersAsArray().map(user => user.name))
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

const makeElevatorRequest = async (userMakingElevatorRequest: User) => {
  // for (const user of usersMakingElevatorRequests) {
  console.log(`${userMakingElevatorRequest.name} is making a request to go to ${userMakingElevatorRequest.destFloor}`)

  const direction = userMakingElevatorRequest.currFloor < userMakingElevatorRequest.destFloor ? Direction.GOING_UP : Direction.GOING_DOWN

  await addElevatorRequest({ fromFloor: userMakingElevatorRequest.currFloor, direction })

  await _lock.acquire(USERS_LOCK, () => {
    //  specify that the user is now waiting for the elevator
    userMakingElevatorRequest.status = UserStatus.WAITING_FOR_ELEVATOR
  })
}

export const processCallingTheElevator = async (name: string) : Promise<void> => {
  const user = users[name]

  if (user.status === UserStatus.NEWLY_SPAWNED) {
    await makeElevatorRequest(user)

    //  broadcast that someone has just made an elevator request
    // console.log('user who just made an elevator request', user.status)

    broadcastUserStatusUpdate(user)
  }
}

//  getting the sense that maybe I should implement the person loop differently, because right now it's acting more as a "peopleLoop"

// export const processGettingOnAndPressingButton = async () : Promise<void> => {
//   const usersArr: User[] = getUsersAsArray()

//   //  check if any users are waiting on the elevator
//   const usersWaitingForElevator = usersArr.filter(user => user.status === UserStatus.WAITING_FOR_ELEVATOR)

//   for (const user of usersMakingElevatorRequests) {
//     console.log(`${user.name} is making a request to go to ${user.destFloor}`)

//     const direction = user.currFloor < user.destFloor ? Direction.GOING_UP : Direction.GOING_DOWN

//     await addElevatorRequest({ fromFloor: user.currFloor, direction })

//     //  specify that the user is now waiting for the elevator
//     user.status = UserStatus.WAITING_FOR_ELEVATOR
//   }
// }
