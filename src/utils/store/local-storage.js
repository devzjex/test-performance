const KEY = {
  ON_BOARDING: 'persist:onboarding',
  COMPARISON_LISTS: 'comparison_lists',
};

const isServer = typeof window === 'undefined';

const storage = {
  get: (key) => (isServer ? null : localStorage.getItem(key)),
};

const LocalStorage = {
  getOnBoarding: () => {
    const data = storage.get(KEY.ON_BOARDING);
    const onboardingData = JSON.parse(data);
    const onboardingState = JSON.parse(onboardingData.onboarding);
    return onboardingState;
  },
  getComparisonLists: () => {
    const data = storage.get(KEY.COMPARISON_LISTS);
    return JSON.parse(data) || [];
  },
  setComparisonLists: (data) => {
    isServer ? null : localStorage.setItem(KEY.COMPARISON_LISTS, JSON.stringify(data));
  },
  removeComparisonLists: () => {
    isServer ? null : localStorage.removeItem(KEY.COMPARISON_LISTS);
  },
};

export default LocalStorage;
