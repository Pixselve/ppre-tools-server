export const state = () => ({
  user: undefined
});

export const mutations = {
  updateUser(state, data) {
    state.user = data;
  }
};

export const getters = {
  GET_SCHOOL_ID(state) {
    return state.user.school.id;
  }
};
