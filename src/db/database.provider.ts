import { Sequelize } from 'sequelize-typescript';
import { Reserve } from './entities/reserve.entity';
import { Room } from './entities/room.entity';
import { User } from './entities/user.entity';

export const Database = [
  {
    provide: 'SEQUELIZE',
    useFactory: async () => {
      const sequelize = new Sequelize({
        dialect: 'mysql',
        host: 'localhost',
        port: 3306,
        username: 'root',
        password: '',
        database: 'hotel_reservation',
      });
      sequelize.addModels([User]);
      sequelize.addModels([Room]);
      sequelize.addModels([Reserve]);
      await sequelize.sync();
      return sequelize;
    },
  },
];
