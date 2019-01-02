const User = () => {
  let user = null;

  const getUser = () => {
    return user
  }

  const setUser = (identity) => {
    user = identity
  }

  return {
    getUser: getUser,
    setUser: setUser
  }
}

module.exports = User;