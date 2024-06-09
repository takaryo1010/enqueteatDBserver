import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Form } from '../forms/entities/form.entity';

const mockUsersRepository = () => ({
  find: jest.fn(),
  findOne: jest.fn(),
  save: jest.fn(),
  delete: jest.fn(),
  findOneBy: jest.fn(),
});

describe('UsersService', () => {
  let service: UsersService;
  let repository: Repository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useFactory: mockUsersRepository,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    repository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  describe('create', () => {
    it('ユーザーが作成されるべき', async () => {
      const newUser = {
        user_id: 1,
        user_email: 'example@gmail.com',
        forms: [],
      };
      jest.spyOn(repository, 'save').mockResolvedValue(newUser);
      expect(await service.create(newUser)).toEqual(newUser);
    });
  });
  describe('findOne', () => {
    it('指定されたユーザー１つが返ってくるべき', async () => {
      const user = {
        user_id: 1,
        user_email: 'example@gmail.com',
        forms: [],
      };
      jest.spyOn(repository, 'findOneBy').mockResolvedValue(user);
      expect(await service.findOne('example@gmail.com')).toEqual(user);
    });
    it("SQLインジェクションが発生する可能性がある", async () => {
      const user = {
        user_id: 1,
        user_email: "1 OR 1=1",
        forms: [],
      };

      jest.spyOn(repository, 'findOneBy').mockResolvedValue(user);
      expect(await service.findOne('1 OR 1=1')).toEqual(user);
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

      jest.spyOn(repository, 'findOneBy').mockResolvedValue(user);
      jest.spyOn(repository, 'save').mockResolvedValue(user);

      const form = new Form();
      form.form_id = form_id;
      const updatedUser = {
        user_id: 1,
        user_email: 'example@gmail.com',
        forms: [form],
      };
      const res = await service.addForm('example@gmail.com', form_id);
      expect(res).toEqual(updatedUser);

    });


    
  });
});
