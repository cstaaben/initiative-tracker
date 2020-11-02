const state = {
  title: "",
  started: false,
  round: null,
  currentTurn: 0,
  combatants: []
};

const getters = {
  getTitle: state => {
    return state.title;
  },
  isStarted: state => {
    return state.started;
  },
  getRoundNum: state => {
    return state.round == null ? 0 : state.round;
  },
  getTimePassed: state => {
    let seconds = state.round <= 1 ? 0 : (state.round - 1) * 6;
    let minutes = Math.floor(seconds / 60);
    let secRem = Math.floor(seconds % 60);

    if (isNaN(minutes)) {
      minutes = 0;
    }
    if (isNaN(secRem)) {
      secRem = 0;
    }

    const strPadLeft = function(str, pad, length) {
      if (str.length > length) {
        return str;
      }
      return (new Array(length + 1).join(pad) + str).slice(-length);
    };

    minutes = strPadLeft(String(minutes), "0", 2);
    secRem = strPadLeft(String(secRem), "0", 2);

    return minutes + ":" + secRem;
  },
  getCurrentTurn: state => {
    return state.currentTurn;
  },
  getCombatants: state => {
    return state.combatants;
  }
};

const mutations = {
  setTitle: (state, value) => {
    state.title = value;
  },
  toggleStarted: state => {
    state.started = !state.started;
  },
  incrementRound: state => {
    state.round++;
  },
  decrementRound: state => {
    if (state.round === 0) {
      return;
    }
    state.round--;
  },
  setRound: (state, round) => {
    state.round = round;
  },
  addCombatant: (state, combatant) => {
    let duplicates = state.combatants.filter(
      candidate => candidate.id === combatant.id
    );

    // early out if no duplicates
    if (duplicates.length <= 1) {
      state.combatants.push(combatant);
      state.combatants.sort(compareCombatants);
      return;
    }

    combatant.id += duplicates.length + 1;
    combatant.name += " " + (duplicates.length + 1);

    duplicates.forEach((dup, i) => {
      dup.name += " " + (i + 1);
      dup.id += i + 1;
    });

    let index;
    do {
      index = state.combatants.findIndex(
        candidate => candidate.id === combatant.id
      );
      state.combatants[index] = duplicates.splice(0, 1);
    } while (index !== -1);
  },
  removeCombatant: (state, id) => {
    if (id === "") {
      return;
    }
    let combatantIndex = state.combatants.findIndex(c => c.id === id);
    state.combatants.splice(combatantIndex, 1);
  },
  updateCombatant: (state, combatant) => {
    if (combatant == null) {
      return;
    }

    let index = state.combatants.findIndex(
      candidate => candidate.id === combatant.id
    );

    if (index === -1) {
      return;
    }

    state.combatants.sort(compareCombatants);
    state.combatants[index] = combatant;
  },
  setCombatants: (state, combatants) => {
    state.combatants = combatants;
    state.combatants.sort(compareCombatants);
  },
  setCurrentTurn: (state, currentTurn) => {
    state.currentTurn = currentTurn;
  },
  incrementTurn: state => {
    if (state.currentTurn === state.combatants.length - 1) {
      state.currentTurn = 0;
      state.round++;
      return;
    }

    state.currentTurn++;
  },
  decrementTurn: state => {
    if (state.round === 1 && state.currentTurn === 0) {
      return;
    }

    if (state.currentTurn === 0) {
      state.currentTurn = state.combatants.length - 1;
      state.round--;
    }

    state.currentTurn--;
  }
};

const actions = {
  setTitle: ({ commit }, title) => {
    commit("setTitle", title);
  },
  toggleStarted: ({ commit }) => {
    commit("toggleStarted");
  },
  incrementRound: ({ commit }) => {
    commit("incrementRound");
  },
  decrementRound: ({ commit }) => {
    commit("decrementRound");
  },
  setRound: ({ commit }, round) => {
    commit("setRound", round);
  },
  incrementTurn: ({ commit }) => {
    commit("incrementTurn");
  },
  decrementTurn: ({ commit }) => {
    commit("decrementTurn");
  },
  setCurrentTurn: ({ commit }, currentTurn) => {
    commit("setCurrentTurn", currentTurn);
  },
  addCombatant: ({ commit }, combatant) => {
    commit("addCombatant", combatant);
  },
  removeCombatant: ({ commit }, combatantIndex) => {
    commit("removeCombatant", combatantIndex);
  },
  updateCombatant: ({ commit }, combatant) => {
    commit("updateCombatant", combatant);
  },
  setCombatants: ({ commit }, combatants) => {
    commit("setCombatants", combatants);
  }
};

export default {
  state,
  mutations,
  getters,
  actions
};

function compareCombatants(a, b) {
  if (a.initiative > b.initiative) {
    return -1;
  } else if (a.initiative < b.initiative) {
    return 1;
  }
  // initiative scores are equal at this point
  if (a.dexterity > b.dexterity) {
    return -1;
  } else if (a.dexterity < b.dexterity) {
    return 1;
  }
  // combatants turn order is truly equal
  return 0;
}
