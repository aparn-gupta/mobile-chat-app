let currentUser = null;

export const setCurrentUser = (loggingUser) => {
  currentUser = loggingUser;
};

export const getCurrentUser = () => {
  return currentUser;
};
