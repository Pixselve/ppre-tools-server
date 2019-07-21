import gql from "~/node_modules/graphql-tag";

export default async function ({ app, redirect, store }) {
  try {
    // If the user is not authenticated
    const token = app.$apolloHelpers.getToken();
    const hasToken = !!token;

    if (!hasToken) throw "";
    if (store.state.user.user === undefined) {
      const { data } = await app.apolloProvider.defaultClient.mutate({
        mutation: gql`
        {
          findOneTeacher(where: {id: "${decodeJWT(token).teacherId}"}) {
            username
            firstName
            lastName
            id
            classrooms {
              id
            }
            school {
              id
            }
          }
        }
        `
      });

      store.commit("user/updateUser", { ...data.findOneTeacher });

    }

  } catch (e) {
    return redirect('/login');
  }
}


const decodeJWT = (token) => {
  let base64Url = token.split('.')[1];
  let buff = new Buffer(base64Url, 'base64');
  let text = buff.toString('ascii');

  let json = JSON.parse(text);

  return json;
};
