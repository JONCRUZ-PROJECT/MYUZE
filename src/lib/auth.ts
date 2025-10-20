import { User } from './data';

export const saveUserToLocalStorage = (user: User) => {
  localStorage.setItem('myuze_user', JSON.stringify(user));
};

export const getUserFromLocalStorage = (): User | null => {
  const userJson = localStorage.getItem('myuze_user');
  return userJson ? JSON.parse(userJson) : null;
};

export const removeUserFromLocalStorage = () => {
  localStorage.removeItem('myuze_user');
};