import AsyncLock from 'async-lock'
import { getRandomFloor, getRandomName } from '../lib/Randomizer'
import { buildingDetails } from './Building'

import { addElevatorRequest } from './ElevatorRequests'

import { People, Person, PersonStatus } from '../lib/types/Person'
import { Direction } from '../lib/types/Elevator'

// const numPeople = 500

//  maybe it's worth converting this to a class so that we can get private variables ... so that you can't modify usersStatus from outside of the class
export let people: People = {}

const _lock = new AsyncLock()

// const NUM_PEOPLE_LOCK = 'num-people-lock'

const PEOPLE_LOCK = 'people-lock'

// export const addPeople = async (increaseBy = 0) : Promise<void> => {
//   await _lock.acquire(NUM_PEOPLE_LOCK, () => {
//     numPeople += increaseBy
//   })
// }

// export const removePeople = async (decreaseBy = 0) : Promise<void> => {
//   await _lock.acquire(NUM_PEOPLE_LOCK, () => {
//     numPeople -= decreaseBy
//   })
// }

/**
 * Reset the list of people.  This a cleanup function that gets called when there are no clients connected to the server
 */
export const clearPeople = () : void => {
  people = {}
}

export const getPeopleAsArray = () : Person[] => {
  return Object.keys(people).map(name => {
    return people[name]
  })
}

/**
 * Returns the number of people who are currently interacting with elevators
 * @returns
 */
export const getNumPeople = () : number => {
  return Object.keys(people).length
}

export const spawnNewPerson = async () : Promise<Person> => {
  const name = getRandomName(getPeopleAsArray().map(person => person.name))
  const currFloor = getRandomFloor(buildingDetails.numFloors)
  const destFloor = getRandomFloor(buildingDetails.numFloors, currFloor)

  await _lock.acquire(PEOPLE_LOCK, () => {
  //  add the newly-spawned person to the list of people
    people[name] = {
      name, currFloor, destFloor, status: PersonStatus.NEWLY_SPAWNED
    }
  })

  return people[name]
}

export const makeElevatorRequest = async (personMakingElevatorRequest: Person) : Promise<void> => {
  // for (const user of usersMakingElevatorRequests) {
  console.log(`${personMakingElevatorRequest.name} is making a request to go to ${personMakingElevatorRequest.destFloor}`)

  const direction = personMakingElevatorRequest.currFloor < personMakingElevatorRequest.destFloor ? Direction.GOING_UP : Direction.GOING_DOWN

  await addElevatorRequest({ destFloor: personMakingElevatorRequest.currFloor, direction })

  await _lock.acquire(PEOPLE_LOCK, () => {
    //  specify that the user is now waiting for the elevator
    personMakingElevatorRequest.status = PersonStatus.WAITING_FOR_ELEVATOR
  })
}

//  getting the sense that maybe I should implement the person loop differently, because right now it's acting more as a "peopleLoop"

// export const processGettingOnAndPressingButton = async () : Promise<void> => {
//   const usersArr: User[] = getUsersAsArray()

//   //  check if any users are waiting on the elevator
//   const usersWaitingForElevator = usersArr.filter(user => user.status === UserStatus.WAITING_FOR_ELEVATOR)

//   for (const user of usersMakingElevatorRequests) {
//     console.log(`${user.name} is making a request to go to ${user.destFloor}`)

//     const direction = user.currFloor < user.destFloor ? Direction.GOING_UP : Direction.GOING_DOWN

//     await addElevatorRequest({ destFloor: user.currFloor, direction })

//     //  specify that the user is now waiting for the elevator
//     user.status = UserStatus.WAITING_FOR_ELEVATOR
//   }
// }
