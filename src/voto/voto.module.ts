import { Module } from '@nestjs/common';
import { VotoController } from './voto.controller';
import { DatabaseModule } from 'src/database/database.module';
import { votoProviders } from './voto.providers';
import { VotoService } from './voto.service';
import { PautasModule } from 'src/pautas/pautas.module';
import { ResultadoController } from './resultado/resultado.controller';
import { AssociadoModule } from 'src/associado/associado.module';

@Module({
  controllers: [VotoController, ResultadoController],
  imports: [DatabaseModule, PautasModule, AssociadoModule],
  providers: [...votoProviders, VotoService],
})
export class VotoModule {}
