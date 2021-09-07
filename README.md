### elevator-app-backend

This is the ExpressJS backend for the [elevator-app-frontend](https://elevator-app-frontend.vercel.app/).  This backend produces and maintains real-time updates about a fictional set of elevators and people moving between floors of a building.  SocketIO is used to push out elevator and person updates to the web frontend

Various lifecycle steps of an elevator are simulated, including:
- waiting for a request
- taking a request
- moving between floors
- stopping at a floor
- opening/closing the elevator doors
- picking up a person
- dropping off a person

**Technology stack:**

- SocketIO (web sockets)
- ExpressJS (nodejs web server)

**Additional packages used:**

- dotenv (referencing local environment variables)