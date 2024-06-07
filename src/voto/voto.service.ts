import { Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Voto } from './voto.entity';

@Injectable()
export class VotoService {
  constructor(
    @Inject('VOTO_REPOSITORY')
    private readonly votoRepository: Repository<Voto>,
  ) {}
}
