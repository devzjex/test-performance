import { combineReducers } from '@reduxjs/toolkit';
import myAppsReducer from './my-apps/MyApps';
import loginAppReducer from './auth/LoginApp';
import registerAppReducer from './auth/RegisterApp';
import onboardingStateReducer from './onboarding/OnboardingState';
import onboardingReducer from './onboarding/Onboarding';

const rootReducer = combineReducers({
  myApps: myAppsReducer,
  loginApp: loginAppReducer,
  registerApp: registerAppReducer,
  onboardingState: onboardingStateReducer,
  onboarding: onboardingReducer,
});

export default rootReducer;
