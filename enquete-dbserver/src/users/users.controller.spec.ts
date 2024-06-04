import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { Form } from '../forms/entities/form.entity';
const mockUsersService = () => ({
  create: jest.fn(),
  findOne: jest.fn(),
});

describe('UsersController', () => {
  let controller: UsersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        UsersService,
        { provide: UsersService, useFactory: mockUsersService },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  describe('create', () => {
    it('新しく作ったユーザーが返ってくるべき', async () => {
      const newUser = {
        user_id: 1,
        user_email: 'example@gmail.com',
        forms: [],
      };
      jest.spyOn(controller, 'create').mockResolvedValue(newUser);
      expect(await controller.create(newUser)).toEqual(newUser);
    });
  });

  describe('findOne', () => {
    it('指定されたユーザー１つが返ってくるべき', async () => {
      const user = {
        user_id: 1,
        user_email: 'example@gmail.com',
        forms: [],
      };
      jest.spyOn(controller, 'findOne').mockResolvedValue(user);
      expect(await controller.findOne('example@gmail.com')).toEqual(user);
    });
  });

  describe('update', () => {
    it('ユーザーのformsの値が追加されて更新されるべき', async () => {
      const user = {
        user_id: 1,
        user_email: 'example@gmail.com',
        forms: [],
      };
      const form_id = 1;
      jest.spyOn(controller, 'addForm').mockResolvedValueOnce(user); 

      const form = new Form();
      form.form_id = form_id;
      const updatedUser = {
        user_id: 1,
        user_email: 'example@gmail.com',
        forms: [form],
      };
      const res = await controller.addForm('example@gmail.com', form_id)
      console.log(res)
      expect(res).toEqual(
        updatedUser,
      );
    });
  });
});
