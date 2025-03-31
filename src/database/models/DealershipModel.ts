import { JSONSchema, ModelObject } from 'objection';
import { BaseModel } from './BaseModel.js';
import { UserModel } from './UserModel.js';

class DealershipModel extends BaseModel {
  static tableName = 'dealerships';

  id!: number;
  name!: string;
  users!: UserModel[] | null;

  static jsonSchema: JSONSchema = {
    type: 'object',
    required: ['name'],
    properties: {
      id: { type: 'integer' },
      name: { type: 'string' },
    },
  };

  static get relationMappings() {
    return {
      users: {
        relation: BaseModel.HasManyRelation,
        modelClass: UserModel,
        join: {
          from: 'dealerships.id',
          to: 'users.dealershipId',
        },
      },
    };
  }
}

export { DealershipModel };
export type DealershipSchema = ModelObject<DealershipModel>;
