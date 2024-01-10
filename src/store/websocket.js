import WebSocket from 'websocket';

const state = {
  socket: null,
  messages: [],
};

const mutations = {
  SET_SOCKET(state, socket) {
    state.socket = socket;
  },
  ADD_MESSAGE(state, message) {
    state.messages.push(message);
  },
};

const actions = {
  initializeWebSocket({ state, commit }, wsUrl) {
    if (state.socket && state.socket.readyState === WebSocket.OPEN) {
      state.socket.close();
    }
    const socket = new WebSocket(wsUrl);

    socket.onopen = event => {
      console.log('WebSocket connection opened:', event);
    };

    socket.onmessage = event => {
      const message = JSON.parse(event.data);
      commit('ADD_MESSAGE', message);
    };

    socket.onclose = event => {
      console.log('WebSocket connection closed:', event);
    };

    commit('SET_SOCKET', socket);
  },
  sendMessage({ state }, message) {
    if (state.socket && state.socket.readyState === WebSocket.OPEN) {
      state.socket.send(JSON.stringify(message));
    }
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
};
