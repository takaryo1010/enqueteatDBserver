import { Test, TestingModule } from '@nestjs/testing';
import { TextAnswerController } from './text-answer.controller';
import { TextAnswerService } from './text-answer.service';
import { CreateTextAnswerDto } from './dto/create-text-answer.dto';
import { TextAnswer } from './entities/text-answer.entity';
const mockTextAnswerService = () => ({
  create: jest.fn(),
  findAll: jest.fn(),
  findOne: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),

});


describe('TextAnswerController', () => {
  let controller: TextAnswerController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TextAnswerController],
      providers: [TextAnswerService,
        { provide: TextAnswerService, useFactory: mockTextAnswerService },
      ],
    }).compile();

    controller = module.get<TextAnswerController>(TextAnswerController);
  });

  describe('create', () => {
    it('回答テキストが追加されるべき', async () => {
      const newTextAnswer = {
        text: 'Answer 1',
        choice: { choice_id: 1 },
      }as TextAnswer;
      jest.spyOn(controller, 'create').mockResolvedValue(newTextAnswer);

      expect(await controller.create(newTextAnswer)).toEqual(newTextAnswer);
    });
  });
  describe('findAll', () => {
    it('回答テキストの配列が返ってくるべき', async () => {
      const textAnswerArray = [
        {
          answer_id: 1,
          text: 'Answer 1',
          choice: { choice_id: 1 },
        } as TextAnswer,
        {
          answer_id: 2,
          text: 'Answer 2',
          choice: { choice_id: 2 },
        } as TextAnswer,
      ];

      jest.spyOn(controller, 'findAll').mockResolvedValue(textAnswerArray);

      expect(await controller.findAll()).toEqual(textAnswerArray);
    });
  });
  describe('findOne', () => {
    it('指定された回答テキスト１つが返ってくるべき', async () => {
      const textAnswer = {
        answer_id: 1,
        text: 'Answer 1',
        choice: { choice_id: 1 },
      } as TextAnswer;

      jest.spyOn(controller, 'findOne').mockResolvedValue(textAnswer);

      expect(await controller.findOne(1)).toEqual(textAnswer);
    });
    it('回答テキストが無かったらnullが返ってくるべき', async () => {
      jest.spyOn(controller, 'findOne').mockResolvedValue(null);

      expect(await controller.findOne(1)).toBeNull();
    });
  });
  
});
