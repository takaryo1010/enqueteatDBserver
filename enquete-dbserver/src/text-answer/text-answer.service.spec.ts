import { Test, TestingModule } from '@nestjs/testing';
import { TextAnswerService } from './text-answer.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TextAnswer } from './entities/text-answer.entity';
import { Choice } from 'src/choices/entities/choice.entity';
import { CreateTextAnswerDto } from './dto/create-text-answer.dto';
const mockTextAnswerRepository = () => ({
  find: jest.fn(),
  findOneBy: jest.fn(),
  save: jest.fn(),
  delete: jest.fn(),
});

describe('TextAnswerService', () => {
  let service: TextAnswerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TextAnswerService,
        { provide: getRepositoryToken(TextAnswer), useFactory: mockTextAnswerRepository },
      ],
    }).compile();

    service = module.get<TextAnswerService>(TextAnswerService);
  });

  describe('create', () => {
    it('回答テキストが追加されるべき', async () => {
      const newTextAnswer = {  
        text: 'Answer 1',
        choice: { choice_id: 1 } as Choice,
      } as CreateTextAnswerDto & TextAnswer; 

      jest.spyOn(service, 'create').mockResolvedValue(newTextAnswer);

      expect(await service.create(newTextAnswer)).toEqual(newTextAnswer);
    });
  });
  describe('findAll', () => {
    it('回答テキストの配列が返ってくるべき', async () => {
      const textAnswerArray = [
        { answer_id: 1, text: 'Answer 1', choice: { choice_id: 1 } as Choice },
        { answer_id: 2, text: 'Answer 2', choice: { choice_id: 2 } as Choice },
      ] as TextAnswer[];

      jest.spyOn(service, 'findAll').mockResolvedValue(textAnswerArray);

      expect(await service.findAll()).toEqual(textAnswerArray);
    });
  });
  describe('findOne', () => {
    it('指定された回答テキスト１つが返ってくるべき', async () => {
      const textAnswer = { answer_id: 1, text: 'Answer 1', choice: { choice_id: 1 } as Choice } as TextAnswer;

      jest.spyOn(service, 'findOne').mockResolvedValue(textAnswer);

      expect(await service.findOne(1)).toEqual(textAnswer);
    });
    it('回答テキストが無かったらnullが返ってくるべき', async () => {
      jest.spyOn(service, 'findOne').mockResolvedValue(null);

      expect(await service.findOne(1)).toBeNull();
    });
  });

  });
