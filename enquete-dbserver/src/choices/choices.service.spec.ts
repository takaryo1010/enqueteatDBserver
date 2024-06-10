import { Test, TestingModule } from '@nestjs/testing';
import { ChoicesService } from './choices.service';
import { Choice } from './entities/choice.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
const mockChoiceRepository = () => ({
  find: jest.fn(),
  findOneBy: jest.fn(),
  save: jest.fn(),
  delete: jest.fn(),
  vote: jest.fn(),
});
describe('ChoicesService', () => {
  let service: ChoicesService;
  let repository: Repository<Choice>;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ChoicesService,
        {
          provide: getRepositoryToken(Choice),
          useFactory: mockChoiceRepository,
        },
      ],
    }).compile();
    service = module.get<ChoicesService>(ChoicesService);
    repository = module.get<Repository<Choice>>(getRepositoryToken(Choice));
  });

  describe('findAll', () => {
    it('選択肢の配列が返ってくるべき', async () => {
      const choicesArray = [
        {
          choice_id: 1,
          choice_text: 'Choice 1',
          vote_counter: 0,
          question: null,
        },
      ];
      jest.spyOn(repository, 'find').mockResolvedValue(choicesArray);

      expect(await service.findAll()).toEqual(choicesArray);
    });
  });

  describe('findOne', () => {
    it('指定された選択肢１つが返ってくるべき', async () => {
      const choice = {
        choice_id: 1,
        choice_text: 'Choice 1',
        vote_counter: 0,
        question: null,
      };
      jest.spyOn(repository, 'findOneBy').mockResolvedValue(choice);

      expect(await service.findOne(1)).toEqual(choice);
    });

    it('選択肢が無かったらnullが返ってくるべき', async () => {
      jest.spyOn(repository, 'findOneBy').mockResolvedValue(null);

      expect(await service.findOne(1)).toBeNull();
    });
  });

  describe('create', () => {
    it('選択肢が作成され、その選択肢が返ってくるべき', async () => {
      const choice = {
        choice_id: 1,
        choice_text: 'Choice 1',
        vote_counter: 0,
        question: null,
      };
      jest.spyOn(repository, 'save').mockResolvedValue(choice);

      expect(await service.create(choice)).toEqual(choice);
    });
  });

  describe('remove', () => {
    it('指定した選択肢が削除されるべき', async () => {
      const choice = {
        choice_id: 1,
        choice_text: 'Choice 1',
        vote_counter: 0,
        question: null,
      };
      jest.spyOn(repository, 'findOneBy').mockResolvedValue(choice);

      await service.remove(1);

      expect(repository.delete).toHaveBeenCalledWith(1);
    });
  });

  describe('vote', () => {
    it('指定した選択肢が更新されるべき', async () => {
      const choice = {
        choice_id: 1,
        choice_text: 'Choice 1',
        vote_counter: 0,
        question: null,
      };
      jest.spyOn(repository, 'findOneBy').mockResolvedValue(choice);
      jest.spyOn(repository, 'save').mockResolvedValue(choice);

      let newChoice: Choice = { ...choice, vote_counter: 1 };
      let real:Choice =await service.vote(choice.choice_id);
      expect(real).toEqual(newChoice);
    });
      it('指定した選択肢が存在しない場合、エラーが発生するべき', async () => {
        jest.spyOn(repository, 'findOneBy').mockResolvedValue(null);
        let choice = {
          choice_id: 1,
          choice_text: 'Choice 1',
          vote_counter: 0,
          question: null,
        };
        try {
          await service.vote(choice.choice_id);
        } catch (e) {
          expect(e.message).toBe('Choice not found');
        }
      });
  });
  
  describe('update', () => {
    it('指定した選択肢が更新されるべき', async () => {
      const choice = {
        choice_id: 1,
        choice_text: 'Choice 1',
        vote_counter: 0,
        question: null,
      };
      const updatedChoice = {
        choice_id: 1,
        choice_text: 'Updated Choice',
        vote_counter: 0,
        question: null,
      };
      jest.spyOn(repository, 'findOneBy').mockResolvedValue(choice);
      jest.spyOn(repository, 'save').mockResolvedValue(updatedChoice);

      expect(await service.update(1, updatedChoice)).toEqual({
        ...choice,
        ...updatedChoice,
      });
    });
    it('選択肢が見つからなかったらエラーが返ってくるべき', async () => {
      jest.spyOn(repository, 'findOneBy').mockResolvedValue(null);
      const updatedChoice = {
        choice_id: 1,
        choice_text: 'Updated Choice',
        vote_counter: 0,
        question: null,
      };
      try {
        await service.update(1, updatedChoice);
      } catch (e) {
        expect(e.message).toBe('Choice not found');
      }
    });
  });
  
    
});
