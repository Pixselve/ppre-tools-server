export const state = () => ({
  message: '',
  color: "success"
});

export const mutations = {
  show(state, { message, color }) {
    state.message = message;
    state.color = color;
  }
};
