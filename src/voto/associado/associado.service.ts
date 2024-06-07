import { Inject, Injectable } from '@nestjs/common';
import { Associado } from './associado.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AssociadoService {
  constructor(
    @Inject('ASSOCIADO_REPOSITORY')
    private readonly associadoRepository: Repository<Associado>,
  ) {}
}
