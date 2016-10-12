export default (socket, channelName = "action") => store => {
  socket.on(channelName, store.dispatch);

  return next => action => {
    if (action.meta && action.meta.remote) {
      socket.emit(channelName, action);
    }
    return next(action);
  }
}