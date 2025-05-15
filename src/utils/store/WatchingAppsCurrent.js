import Auth from './Authentication';

function addToListWatchingApps(app) {
  let oldObject = JSON.parse(getListWatchingApps());
  if (oldObject) {
    if (!!oldObject.find((item) => item.app_id === app.app_id)) {
      return;
    }
    while (oldObject.length >= 20) {
      oldObject.shift();
    }
    const listObject = oldObject;
    listObject.push(app);
    Auth.setWatchingAppsKey(listObject);
  } else {
    const newObject = [];
    newObject.push(app);
    Auth.removeWatchingAppsKey();
    Auth.setWatchingAppsKey(newObject);
  }
}

function getListWatchingApps() {
  return Auth.getWatchingAppsKey();
}

let WatchingAppsCurrent = {
  addToListWatchingApps: addToListWatchingApps,
  getListWatchingApps: getListWatchingApps,
};
export default WatchingAppsCurrent;
