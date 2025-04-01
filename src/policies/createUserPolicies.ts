import { UserModel, UserRoles } from '../database/models/UserModel.js';

export function canCreateUserPolicy(user: UserModel): boolean {
  if (user.role === UserRoles.dealership) {
    return user.dealershipId ? true : false;
  }

  return true;
}
