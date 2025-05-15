const currentUserKey = 'current-user';
const currentUNKey = 'current-un-Key';
const currentSubcriptionKey = 'current-subscription';
const isStore = 'is-store';
const watchingApps = 'watching-apps';
const previousUrlPage = 'previousUrl';
const isHasPassword = 'has_password';

function setToken(token) {
  if (typeof window !== 'undefined') {
    localStorage.setItem('accessToken', token);
  }
}
function getAccessToken() {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('accessToken');
  }
  return null;
}
function setAccessToken(accessToken) {
  if (typeof window !== 'undefined') {
    return localStorage.setItem('accessToken', accessToken);
  }
  return null;
}
function setRefreshToken(refreshToken) {
  if (typeof window !== 'undefined') {
    localStorage.setItem('refreshToken', refreshToken);
  }
}
function getRefreshToken() {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('refreshToken');
  }
  return null;
}

function removeToken() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('accessToken');
  }
}

function removeRefreshToken() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('refreshToken');
  }
}

function setCurrentUser(currentUser) {
  if (typeof window !== 'undefined') {
    localStorage.setItem(currentUserKey, currentUser);
  }
}

function getCurrentUser() {
  if (typeof window !== 'undefined') {
    return localStorage.getItem(currentUserKey);
  }
  return null;
}

function setCurrentUserName(currentUser) {
  if (typeof window !== 'undefined') {
    localStorage.setItem(currentUNKey, currentUser);
  }
}

function getCurrentUserName() {
  if (typeof window !== 'undefined') {
    return localStorage.getItem(currentUNKey);
  }
  return null;
}

function removeCurrentUserName() {
  if (typeof window !== 'undefined') {
    return localStorage.removeItem(currentUNKey);
  }
  return null;
}

function setCurrentSubscription(currentSubType) {
  if (typeof window !== 'undefined') {
    localStorage.setItem(currentSubcriptionKey, currentSubType);
  }
}

function getCurrentSubscription() {
  if (typeof window !== 'undefined') {
    return localStorage.getItem(currentSubcriptionKey);
  }
  return null;
}

function setIsStore(store) {
  if (typeof window !== 'undefined') {
    localStorage.setItem(isStore, store);
  }
}

function getIsStore() {
  if (typeof window !== 'undefined') {
    return localStorage.getItem(isStore) === 'true';
  }
  return null;
}

function removeIsStore() {
  if (typeof window !== 'undefined') {
    return localStorage.removeItem(isStore);
  }
}

function removeCurrentSubscription() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(currentSubcriptionKey);
  }
}

function removeCurrentUser() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(currentUserKey);
  }
}

function isAuthenticated() {
  return getAccessToken() !== undefined && getAccessToken() !== null;
}

function getWatchingAppsKey() {
  if (typeof window !== 'undefined') {
    return localStorage.getItem(watchingApps + '-object');
  }
  return null;
}

function setWatchingAppsKey(listObject) {
  if (typeof window !== 'undefined') {
    localStorage.setItem(watchingApps + '-object', JSON.stringify(listObject));
  }
}

function removeWatchingAppsKey() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(watchingApps + '-object');
  }
}

function setPreviousUrl(previousUrl) {
  if (typeof window !== 'undefined') {
    localStorage.setItem(previousUrlPage, previousUrl);
  }
}

function getPreviousUrl() {
  if (typeof window !== 'undefined') {
    return localStorage.getItem(previousUrlPage);
  }
  return null;
}

function setIsHasPassword(has_password) {
  if (typeof window !== 'undefined') {
    localStorage.setItem(isHasPassword, has_password);
  }
}

function getIsHasPassword() {
  if (typeof window !== 'undefined') {
    return localStorage.getItem(isHasPassword) === 'true';
  }
  return null;
}

function removeIsHasPassword() {
  if (typeof window !== 'undefined') {
    return localStorage.removeItem(isHasPassword);
  }
}

let Auth = {
  setToken: setToken,
  setCurrentUser: setCurrentUser,
  getCurrentUser: getCurrentUser,
  setCurrentUserName: setCurrentUserName,
  getCurrentUserName: getCurrentUserName,
  setCurrentSubscription: setCurrentSubscription,
  getCurrentSubscription: getCurrentSubscription,
  getAccessToken: getAccessToken,
  setRefreshToken: setRefreshToken,
  getRefreshToken: getRefreshToken,
  isAuthenticated: isAuthenticated,
  setAccessToken: setAccessToken,
  setIsStore: setIsStore,
  getIsStore: getIsStore,
  getWatchingAppsKey: getWatchingAppsKey,
  setWatchingAppsKey: setWatchingAppsKey,
  removeWatchingAppsKey: removeWatchingAppsKey,
  setPreviousUrl: setPreviousUrl,
  getPreviousUrl: getPreviousUrl,
  setIsHasPassword: setIsHasPassword,
  getIsHasPassword: getIsHasPassword,
  logout() {
    removeToken();
    removeCurrentUser();
    removeRefreshToken();
    removeCurrentUserName();
    removeCurrentSubscription();
    removeIsStore();
    removeIsHasPassword();
  },
};
export default Auth;
