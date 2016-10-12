"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (socket) {
  var channelName = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "action";

  return function (store) {
    socket.on(channelName, store.dispatch);

    return function (next) {
      return function (action) {
        if (action.meta && action.meta.remote) {
          socket.emit(channelName, action);
        }
        return next(action);
      };
    };
  };
};