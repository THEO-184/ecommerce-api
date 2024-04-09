import { Test, TestingModule } from '@nestjs/testing';
import { SesServiceService } from './ses-service.service';

describe('SesServiceService', () => {
  let service: SesServiceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SesServiceService],
    }).compile();

    service = module.get<SesServiceService>(SesServiceService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
