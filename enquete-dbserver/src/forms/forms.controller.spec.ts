import { Test, TestingModule } from '@nestjs/testing';
import { FormsController } from './forms.controller';
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

describe('FormsController', () => {
  let controller: FormsController;
  let service: FormsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FormsController],
      providers: [
        FormsService,
        { provide: getRepositoryToken(Form), useFactory: mockFormRepository },
      ],
    }).compile();

    controller = module.get<FormsController>(FormsController);
    service = module.get<FormsService>(FormsService);
  });

  describe('findAll', () => {
    it('フォームの配列が返ってくるべき', async () => {
      const formsArray = [{ form_id: 1, form_title: 'Form 1', questions: [] }]as Form[];
      jest.spyOn(service, 'findAll').mockResolvedValue(formsArray);

      expect(await controller.findAll()).toEqual(formsArray);
    });
  });

  describe('findOne', () => {
    it('指定されたフォーム１つが返ってくるべき', async () => {
      const form = { form_id: 1, form_title: 'Form 1', questions: [] }as Form;
      jest.spyOn(service, 'findOne').mockResolvedValue(form);

      expect(await controller.findOne(1)).toEqual(form);
    });
    it('フォームが無かったらnullが返ってくるべき', async () => {
      jest.spyOn(service, 'findOne').mockResolvedValue(null);

      expect(await controller.findOne(1)).toBeNull();
    });
  });

  describe('create', () => {
    it('フォームが作成され、そのフォームが返ってくるべき', async () => {
      const newForm = { form_id: 1, form_title: 'New Form', questions: [] }as Form;
      jest.spyOn(service, 'create').mockResolvedValue(newForm);

      expect(await controller.create(newForm)).toEqual(newForm);
    });
  });

  describe('remove', () => {
    it('指定したフォームが削除されるべき', async () => {
      const id = 1;
      jest.spyOn(service, 'remove').mockResolvedValue(undefined);

      expect(await controller.remove(id)).toBeUndefined();
    });
  });

  describe('update', () => {
    it('指定したフォームが更新されるべき', async () => {
      const id = 1;
      const updatedForm = { form_id: 1, form_title: 'Updated Form', questions: [] } as Form;
      jest.spyOn(service, 'update').mockResolvedValue(updatedForm);

      expect(await controller.update(id, updatedForm)).toEqual(updatedForm);
    });
    it('フォームが無かったらエラーが返ってくるべき', async () => {
      const id = 1;
      const updatedForm = { form_id: 1, form_title: 'Updated Form', questions: [] } as Form;
      jest.spyOn(service, 'update').mockRejectedValue(new Error('Form not found'));

      expect(controller.update(id, updatedForm)).rejects.toThrowError('Form not found');
    });
  });
    
});
