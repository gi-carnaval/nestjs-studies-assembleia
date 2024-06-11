import { Provider } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Associado } from './associado.entity';

const associadoRepository: Provider<Repository<Associado>> = {
  provide: 'ASSOCIADO_REPOSITORY',
  useFactory: (dataSource: DataSource) => {
    return dataSource.getRepository(Associado);
  },
  inject: ['DATA_SOURCE'],
};

export const associadoProviders: Provider[] = [associadoRepository];
