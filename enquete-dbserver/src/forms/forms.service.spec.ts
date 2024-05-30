import { Test, TestingModule } from '@nestjs/testing';
import { FormsService } from './forms.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Form } from './entities/form.entity';
import { Repository } from 'typeorm';

const mockFormRepository = () => ({
  find: jest.fn(),
  findOneBy: jest.fn(),
  save: jest.fn(),
  delete: jest.fn(),
});

describe('FormsService', () => {
  let service: FormsService;
  let repository: Repository<Form>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FormsService,
        { provide: getRepositoryToken(Form), useFactory: mockFormRepository },
      ],
    }).compile();

    service = module.get<FormsService>(FormsService);
    repository = module.get<Repository<Form>>(getRepositoryToken(Form));
  });

  describe('findAll', () => {
    it('フォームの配列が返ってくるべき', async () => {
      const formArray = [
        { form_id: 1, form_title: 'Form 1', questions: [] },
        { form_id: 2, form_title: 'Form 2 日本語', questions: [] },
      ];
      jest.spyOn(repository, 'find').mockResolvedValue(formArray);

      expect(await service.findAll()).toEqual(formArray);
    });
  });

  describe('findOne', () => {
    it('指定されたフォーム１つが返ってくるべき', async () => {
      const form = { form_id: 1, form_title: 'Form 1', questions: [] };
      jest.spyOn(repository, 'findOneBy').mockResolvedValue(form);

      expect(await service.findOne(1)).toEqual(form);
    });

    it('フォームが無かったらnullが返ってくるべき', async () => {
      jest.spyOn(repository, 'findOneBy').mockResolvedValue(null);

      expect(await service.findOne(1)).toBeNull();
    });
  });

  describe('create', () => {
    it('フォームが作成され、そのフォームが返ってくるべき', async () => {
      const form = { form_id: 1, form_title: 'New Form', questions: [] };
      jest.spyOn(repository, 'save').mockResolvedValue(form);

      expect(await service.create(form as Form)).toEqual(form);
    });
  });

  describe('remove', () => {
    it('指定したフォームが削除されるべき', async () => {
      jest.spyOn(repository, 'delete').mockResolvedValue(undefined);

      expect(await service.remove(1)).toBeUndefined();
    });
  });
});
