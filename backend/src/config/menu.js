import { restaurantProfiles } from './restaurantProfiles.js';

const profileId = process.env.RESTAURANT_CONFIG || 'biacreps';
const activeProfile = restaurantProfiles[profileId] || restaurantProfiles.biacreps;
const profilePixKey = process.env[`PIX_KEY_${profileId.toUpperCase()}`]
  || (profileId === 'biacreps' ? process.env.PIX_KEY : '')
  || activeProfile.pixKey;

export const restaurant = activeProfile;

export const menu = {
  ...activeProfile,
  pixKey: profilePixKey
};

export function flattenMenuItems() {
  return menu.categories.flatMap((category) => category.items);
}
