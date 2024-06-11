import { Provider } from '@nestjs/common';
import { Voto } from './voto.entity';
import { DataSource, Repository } from 'typeorm';

const votoRepository: Provider<Repository<Voto>> = {
  provide: 'VOTO_REPOSITORY',
  useFactory: (dataSource: DataSource) => {
    return dataSource.getRepository(Voto);
  },
  inject: ['DATA_SOURCE'],
};

export const votoProviders: Provider[] = [votoRepository];
