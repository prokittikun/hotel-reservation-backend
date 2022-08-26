import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { Room } from './room.entity';
import { User } from './user.entity';
@Table
export class Reserve extends Model {
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
  })
  reserve_id: number;

  @ForeignKey(() => User)
  @BelongsTo(() => User, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
    hooks: true,
    as: 'userId',
  })
  user_id: User;
  @ForeignKey(() => Room)
  @BelongsTo(() => Room, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
    hooks: true,
    as: 'roomId',
  })
  room_id: Room;

  @Column({
    allowNull: false,
  })
  roomService: number;

  @Column({
    allowNull: false,
  })
  checkIn: Date;

  @Column({
    allowNull: false,
  })
  checkOut: Date;

  @Column({
    allowNull: false,
  })
  slip: string;

  @Column({
    allowNull: false,
  })
  status: number;
}
// User.pre('create', function (next) {
//   const user: any = this;

//   // Make sure not to rehash the password if it is already hashed
//   if (!user.isModified('password')) {
//     return next();
//   }

//   // Generate a salt and use it to hash the user's password

//   bcrypt.genSalt(10, (err, salt) => {
//     if (err) {
//       return next(err);
//     }

//     // tslint:disable-next-line:no-shadowed-variable
//     bcrypt.hash(user.password, salt, (err, hash) => {
//       if (err) {
//         return next(err);
//       }
//       user.password = hash;
//       next();
//     });
//   });
// });
// User.beforeCreate(async (user) => {
//   const saltOrRounds = 12;
//   const hash = await bcrypt.hash(user.password, saltOrRounds);
//   const hashedPassword = hash;
//   user.password = hashedPassword;
// });
