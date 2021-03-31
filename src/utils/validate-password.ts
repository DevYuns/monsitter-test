export const validatePassword = (password: string): boolean => {
  const isNumber = password.search(/[0-9]/g);
  const isAlphabet = password.search(/[a-z]/gi);

  if (isNumber < 0 || isAlphabet < 0) {
    return false;
  }
  return true;
};
