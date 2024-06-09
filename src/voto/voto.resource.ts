import { IsIn, IsNotEmpty } from 'class-validator';
import { VoteOption } from './voto.entity';
import { ApiProperty } from '@nestjs/swagger';

export class VoteRegisterResource {
  @ApiProperty()
  @IsNotEmpty({ message: 'Campo CPF é obrigatório' })
  cpf: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'Campo de Opção de Voto é obrigatório' })
  @IsIn([VoteOption.NAO, VoteOption.SIM], {
    message: 'Campo Opção Voto só aceita os valores SIM e NÃO',
  })
  @ApiProperty({ example: 'SIM ou NÃO' })
  voteOption: VoteOption;
}
