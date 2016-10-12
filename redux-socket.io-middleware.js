export default function (socket, channelName = "action") {
  return (store) => {
    socket.on(channelName, store.dispatch);

    return next => action => {
      if (action.meta && action.meta.remote) {
        socket.emit(channelName, action);
      }
      return next(action);
    }
  }
}
