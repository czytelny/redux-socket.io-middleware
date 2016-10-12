# redux-socket.io-middleware
Another dead-simple middleware which allows you to connect Redux and Socket.io.
Is uses `meta` property of your action object to recognize whether send it to backend, or not. 
 

## Idea
- Whenever you want to send an event from **Client** to your **Backend** through socket.io,
 use `store.dispatch` with regular `action` with `meta` object (see example *actionCreator.js*)
- Whenever you want to send and handle an event from your **Backend** to 
**Client** - emit it on backend with socket.io in a form of regular `action` and it will 
be handled by forwarding it to `store.dispatch()` - your reducers 
should take care of the rest of logic.

**Important side note** - action object send thorough Socket.io must be 
 Object literal. It can't be a function (so unfortunately**thunk** drops out).



## Usage

### Installation
```
npm install --save redux-socket.io-middleware
```

### Client side

*store.js*
```javascript
import socketIO from 'socket.io-client';
import socketIoMiddleware from 'redux-socket.io-middleware'

const reducers = (...);

const io = socketIO.connect(`http://localhost:3030`);

const store = createStore(
  reducers,
  applyMiddleware(    
    socketIoMiddleware(io)
  )
);

```

*actionCreator.js*
```javascript
function addUserRequest(user){
  return {
    type: "ADD_USER_REQUEST",
    meta: {remote: true},
    user
  }
}

function addUserRequestSuccess() {
	return {
    	type: "ADD_USER_REQUEST_SUCCESS",       
  }
}

function addUserRequestFailure() {
	return {
    	type: "ADD_USER_REQUEST_FAILURE",       
  	}
}

```
and then somewhere you dispatch this kind of action like any other:

*yourReactComponentContainer.js*
```javascript
const mapDispatchToProps = function (dispatch) {
  return {
    addUserRequest: (user) => dispatch(actionCreator.addUserRequest(user)),
    }
}

```


### Server side

If we share actionCreator.js between client and server we can youse it like below. Otherwise, just create action by hand.

*userController.js*
```javascript
io.on('connection', function (socket) {
    socket.on("action", function (action) {
      switch (action.type) {
        case "ADD_USER_REQUEST":
          return userService.save(action.user).then(
            (user) => io.emit('action', actionCreator.addUserRequestSuccess()),
            (err) => io.emit('action', actionCreator.addUserRequestFailure())
          );
          }
    })
});
```


## Configuration
You can configure the name of channel which will be used for sending websocket messages.
Default value is `action`. To change it, simply add second parameter when registering middleware:

```javascript
import socketIoMiddleware from './redux-socket.io-middleware'

const store = createStore(
  reducers,
  applyMiddleware(    
    socketIoMiddleware(io, "myRandomChannel")
  )
);
```

and then on your backend side, listen on that string:

```javascript
  io.on('connection', function (socket) {
      socket.on("myRandomChannel", function (action) {
        /// ...
      })
  });
````

*Yeah, I know that this readme is much longer than a code itself :) *
