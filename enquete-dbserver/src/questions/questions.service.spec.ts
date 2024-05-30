import { Test, TestingModule } from '@nestjs/testing';
import { QuestionsService } from './questions.service';
import { Question } from './entities/question.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

const mockQuestionRepository = () => ({
  find: jest.fn(),
  findOneBy: jest.fn(),
  save: jest.fn(),
  delete: jest.fn(),
});

describe('QuestionsService', () => {
  let service: QuestionsService;
  let repository: Repository<Question>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        QuestionsService,
        {
          provide: getRepositoryToken(Question),
          useFactory: mockQuestionRepository,
        },
      ],
    }).compile();

    service = module.get<QuestionsService>(QuestionsService);
    repository = module.get<Repository<Question>>(getRepositoryToken(Question));
  });

  describe('findAll', () => {
    it('クエスチョンの配列が返ってくるべき', async () => {
      const questionsArray = [
        {
          question_id: 1,
          question_text: 'Question 1',
          form: null,
          choices: [],
        },
      ];
      jest.spyOn(repository, 'find').mockResolvedValue(questionsArray);

      expect(await service.findAll()).toEqual(questionsArray);
    });
  });

  describe('findOne', () => {
    it('指定されたクエスチョン１つが返ってくるべき', async () => {
      const question = {
        question_id: 1,
        question_text: 'Question 1',
        form: null,
        choices: [],
      };
      jest.spyOn(repository, 'findOneBy').mockResolvedValue(question);

      expect(await service.findOne(1)).toEqual(question);
    });

    it('クエスチョンが無かったらnullが返ってくるべき', async () => {
      jest.spyOn(repository, 'findOneBy').mockResolvedValue(null);

      expect(await service.findOne(1)).toBeNull();
    });
  });

  describe('create', () => {
    it('クエスチョンが作成され、そのクエスチョンが返ってくるべき', async () => {
      const newQuestion = {
        question_id: 1,
        question_text: 'New Question',
        form: null,
        choices: [],
      };
      jest.spyOn(repository, 'save').mockResolvedValue(newQuestion);

      expect(await service.create(newQuestion as Question)).toEqual(newQuestion);
    });
  });  
  
  describe('remove', () => {
    it('指定したクエスチョンが削除されるべき', async () => {
      await service.remove(1);
      expect(repository.delete).toHaveBeenCalledWith(1);
    });
  });
});
