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
    return state.round;
  },
  getCurrentTurn: state => {
    return state.currentTurn;
  },
  getCombatants: state => {
    return state.combatants;
  },
  findCombatant: (state, id) => {
    state.combatants.forEach(combatant => {
      if (combatant.id === id) {
        return combatant;
      }
    });
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
    state.round--;
  },
  addCombatant: (state, combatant) => {
    let duplicates = state.combatants.filter(
      candidate => candidate.id === combatant.id
    );

    combatant.id += duplicates.length + 1;
    combatant.name += " " + (duplicates.length + 1);

    if (duplicates.length > 0) {
      duplicates.sort((a, b) => {
        if (a.initiative < b.initiative) {
          return -1;
        } else if (a.initiative > b.initiative) {
          return 1;
        }
        // initiative scores are equal at this point
        if (a.dexterity < b.dexterity) {
          return -1;
        } else if (a.dexterity > b.dexterity) {
          return 1;
        }
        // combatants turn order is truly equal
        return 0;
      });

      duplicates.forEach((dup, i) => {
        dup.name += " " + (i + 1);
        dup.id += i + 1;
      });
    }

    let index;
    do {
      index = state.combatants.findIndex(
        candidate => candidate.id === combatant.id
      );
      state.combatants[index] = duplicates.splice(0, 1);
    } while (index !== -1);

    state.combatants.push(combatant);
  },
  removeCombatant: (state, combatantIndex) => {
    if (combatantIndex === -1) {
      return;
    }
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

    state.combatants[index] = combatant;
  },
  incrementTurn: state => {
    state.currentTurn++;
  },
  decrementTurn: state => {
    state.currentTurn++;
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
  incrementTurn: ({ commit }) => {
    commit("incrementTurn");
  },
  decrementTurn: ({ commit }) => {
    commit("decrementTurn");
  },
  addCombatant: ({ commit }, combatant) => {
    commit("addCombatant", combatant);
  },
  removeCombatant: ({ commit }, combatantIndex) => {
    commit("removeCombatant", combatantIndex);
  },
  updateCombatant: ({ commit }, combatant) => {
    commit("updateCombatant", combatant);
  }
};

export default {
  state,
  mutations,
  getters,
  actions
};
