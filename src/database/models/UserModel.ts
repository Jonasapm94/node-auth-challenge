import { JSONSchema, ModelObject } from 'objection';
import { BaseModel } from './BaseModel.js';
import { DealershipModel, DealershipSchema } from './DealershipModel.js';

export enum UserRoles {
  admin = 'admin',
  dealership = 'dealership',
}

class UserModel extends BaseModel {
  static tableName = 'users';

  id!: number;
  name!: string;
  email!: string;
  password!: string;
  encryptedPassword!: string;
  role!: UserRoles;
  dealership!: DealershipSchema | null;
  dealershipId!: number | null;

  static jsonSchema: JSONSchema = {
    type: 'object',
    required: ['name', 'email', 'encryptedPassword', 'role'],
    properties: {
      id: { type: 'integer' },
      name: { type: 'string' },
      email: { type: 'string', format: 'email' },
      encryptedPassword: { type: 'string' },
      role: { type: 'string', enum: Object.values(UserRoles) },
    },
  };

  static get relationMappings() {
    return {
      dealership: {
        relation: BaseModel.BelongsToOneRelation,
        modelClass: DealershipModel,
        join: {
          from: 'users.dealershipId',
          to: 'dealerships.id',
        },
      },
    };
  }
}

export { UserModel };
export type UserSchema = ModelObject<UserModel>;
