import gql from "~/node_modules/graphql-tag";

export const state = () => ({
  teachers: undefined
});

export const mutations = {
  SET(state, data) {
    state.teachers = data;
  }
};

export const actions = {
  async UPDATE(store) {

    // @ts-ignore
    let client = this.app.apolloProvider.defaultClient;
    // @ts-ignore
    let schoolId = this.app.store.getters["user/GET_SCHOOL_ID"];

    const { data } = await client.query({
      fetchPolicy: "no-cache",
      query: gql`
          {
            findOneSchool(where: {id: "${schoolId}"}) {
            id
              teachers {
                id
                firstName
                lastName
                avatar
                username
                email
                classrooms {
                  id
                  name
                }
              }
            }
          }

        `
    });
    store.commit("SET", data.findOneSchool.teachers);
  }
};
