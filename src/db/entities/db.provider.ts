/* eslint-disable prettier/prettier */
import { Reserve } from './reserve.entity';
import { Room } from './room.entity';
import { User } from './user.entity';
export const databaseProviders = [
  {
    provide: 'USERS_REPOSITORY',
    useValue: User,
  },
  {
    provide: 'ROOMS_REPOSITORY',
    useValue: Room,
  },
  {
    provide: 'RESERVES_REPOSITORY',
    useValue: Reserve,
  },
];
