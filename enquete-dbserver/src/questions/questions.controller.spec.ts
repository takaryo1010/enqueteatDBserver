import { Test, TestingModule } from '@nestjs/testing';
import { QuestionsController } from './questions.controller';
import { QuestionsService } from './questions.service';
import { Question } from './entities/question.entity';

const mockQuestionsService = () => ({
  findAll: jest.fn(),
  findOne: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
});

describe('QuestionsController', () => {
  let controller: QuestionsController;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [QuestionsController],
      providers: [
        QuestionsService,
        { provide: QuestionsService, useFactory: mockQuestionsService },
      ],
    }).compile();

    controller = module.get<QuestionsController>(QuestionsController);
  });

  describe('findAll', () => {
    it('クエスチョンの配列が返ってくるべき', async () => {
      const result = [
        {
          question_id: 1,
          question_type: 1,
          question_text: 'Question 1',
          form: null,
          choices: [],
        },
      ];
      jest.spyOn(controller, 'findAll').mockResolvedValue(result);

      expect(await controller.findAll()).toEqual(result);
    });
  });

  describe('findOne', () => {
    it('指定されたクエスチョン１つが返ってくるべき', async () => {
      const result = {
        question_id: 1,
        question_type: 1,
        question_text: 'Question 1',
        form: null,
        choices: [],
      };
      jest.spyOn(controller, 'findOne').mockResolvedValue(result);

      expect(await controller.findOne(1)).toEqual(result);
    });

    it('クエスチョンが無かったらnullが返ってくるべき', async () => {
      jest.spyOn(controller, 'findOne').mockResolvedValue(null);

      expect(await controller.findOne(1)).toBeNull();
    });
  });

  describe('findOneByFormId', () => {
    it('指定されたフォームIDのクエスチョンの配列が返ってくるべき', async () => {
      const result = [
        {
          question_id: 1,
          question_type: 1,
          question_text: 'Question 1',
          form: null,
          choices: [],
        },
        {
          question_id: 2,
          question_type: 1,
          question_text: 'Question 2',
          form: null,
          choices: [],
        },
      ];
      jest.spyOn(controller, 'findOneByFormId').mockResolvedValue(result);

      expect(await controller.findOneByFormId(1)).toEqual(result);
    });
    it('指定されたフォームIDのクエスチョンが無かったら空の配列が返ってくるべき', async () => {
      jest.spyOn(controller, 'findOneByFormId').mockResolvedValue([]);

      expect(await controller.findOneByFormId(1)).toEqual([]);
    });
  });
  describe('create', () => {
    it('クエスチョンが作成され、そのクエスチョンが返ってくるべき', async () => {
      const result = {
        question_id: 1,
        question_type: 1,
        question_text: 'Question 1',
        form: null,
        choices: [],
      };
      jest.spyOn(controller, 'create').mockResolvedValue(result);

      expect(await controller.create(result)).toEqual(result);
    });
  });

  describe('remove', () => {
    it('指定したクエスチョンが１つ削除されるべきです', async () => {
      jest.spyOn(controller, 'remove').mockResolvedValue(undefined);

      expect(await controller.remove(1)).toBeUndefined();
    });
  });

  describe('update', () => {
    it('指定したクエスチョンのテキストが更新されるべき', async () => {
      const id = 1;
      const updateQuestion = {
        question_id: 1,
        question_type: 1,
        question_text: 'Updated Question',
        form: null,
        choices: [],
      } as Question;
      jest.spyOn(controller, 'update').mockResolvedValue(updateQuestion);

      expect(await controller.update(1, updateQuestion)).toEqual(
        updateQuestion,
      );
    });
    it('クエスチョンが見つからなかったらエラーが返ってくるべき', async () => {
      jest.spyOn(controller, 'update').mockRejectedValue(new Error('Not found'));

      await expect(
        controller.update(1, {
          question_id: 1,
          question_type: 1,
          question_text: 'Updated Question',
          form: null,
          choices: [],
        } as Question),
      ).rejects.toThrowError('Not found');
    });
      

  });
});
