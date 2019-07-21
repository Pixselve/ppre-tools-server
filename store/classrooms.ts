import gql from "~/node_modules/graphql-tag";

export const state = () => ({
  classrooms: []
});


export const mutations = {
  SET_CLASSROOMS(state, data) {
    state.classrooms = data;
  }
};

export const getters = {
  GET({ classrooms }) {
    return classrooms;
  }
};

export const actions = {
  async UPDATE({ commit }) {

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
              classrooms {
                id
                name
                academicLevel
                teachers {
                  firstName
                  lastName
                }
                studentsClassYears {
                  id
                }
              }
            }
          }

        `
    });
    console.log(data);
    commit("SET_CLASSROOMS", data.findOneSchool.classrooms);
  }
};
