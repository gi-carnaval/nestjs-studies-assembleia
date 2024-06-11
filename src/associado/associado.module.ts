import { Module } from '@nestjs/common';
import { associadoProviders } from './associado.providers';
import { AssociadoController } from './associado.controller';
import { DatabaseModule } from 'src/database/database.module';
import { AssociadoService } from './associado.service';

@Module({
  imports: [DatabaseModule],
  controllers: [AssociadoController],
  providers: [...associadoProviders, AssociadoService],
  exports: [AssociadoService],
})
export class AssociadoModule {}
