export default (userOne, userTwo) => {
  if (
    userOne.id === userTwo.id
    && userOne.firstName === userTwo.firstName
    && userOne.lastName === userTwo.lastName
    && userOne.username === userTwo.username
  ) {
    return true;
  }
  return false;
};
