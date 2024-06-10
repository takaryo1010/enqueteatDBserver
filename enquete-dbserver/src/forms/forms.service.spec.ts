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
      ] as Form[]; // Cast formArray to Form[]
      jest.spyOn(repository, 'find').mockResolvedValue(formArray);

      expect(await service.findAll()).toEqual(formArray);
    });
  });

  describe('findOne', () => {
    it('指定されたフォーム１つが返ってくるべき', async () => {
      const form = { form_id: 1, form_title: 'Form 1', questions: [] } as Form; // Cast form to Form
      jest.spyOn(repository, 'findOneBy').mockResolvedValue(form);

      expect(await service.findOne(1)).toEqual(form);
    });

    it('フォームが無かったらnullが返ってくるべき', async () => {
      jest.spyOn(repository, 'findOneBy').mockResolvedValue(null);

      expect(await service.findOne(1)).toBeNull();
    });
  });
  describe('findByAdminister', () => {
    it('指定された管理者のフォームが返ってくるべき', async () => {
      const formArray = [
        { form_id: 1, form_title: 'Form 1', questions: [] },
        { form_id: 2, form_title: 'Form 2 日本語', questions: [] },
      ] as Form[]; // Cast formArray to Form[]
      jest.spyOn(repository, 'find').mockResolvedValue(formArray);

      expect(await service.findByAdminister('admin')).toEqual(formArray);
    });
  });
  describe('create', () => {
    it('フォームが作成され、そのフォームが返ってくるべき', async () => {
      const form = { form_id: 1, form_title: 'New Form', questions: [] } as Form;
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
  describe('update', () => {
    it('指定したフォームのタイトルが更新されるべき', async () => {
      const form = { form_id: 1, form_title: 'Form 1', questions: [] } as Form;
      const updateForm = { form_title: 'Updated Form' } as Form;
      jest.spyOn(repository, 'findOneBy').mockResolvedValue(form);
      jest.spyOn(repository, 'save').mockResolvedValue({ ...form, ...updateForm });

      expect(await service.update(1, updateForm)).toEqual({ ...form, ...updateForm });
    });

    it('フォームが見つからなかったらエラーが返ってくるべき', async () => {
      jest.spyOn(repository, 'findOneBy').mockResolvedValue(null);

      await expect(service.update(1, { form_title: 'Updated Form' } as Form)).rejects.toThrowError('Form not found');
    });
  });
    
    
});
