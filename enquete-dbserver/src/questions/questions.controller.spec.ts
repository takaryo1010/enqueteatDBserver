import { Test, TestingModule } from '@nestjs/testing';
import { QuestionsController } from './questions.controller';
import { QuestionsService } from './questions.service';

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
      providers: [QuestionsService,{ provide: QuestionsService, useFactory: mockQuestionsService }],
    }).compile();
    
    controller = module.get<QuestionsController>(QuestionsController);
  });

  describe('findAll', () => {
    it('クエスチョンの配列が返ってくるべき', async () => {
      const result = [
        {
          question_id: 1,
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

  describe('create', () => {
    it('クエスチョンが作成され、そのクエスチョンが返ってくるべき', async () => {
      const result = {
        question_id: 1,
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
});
