import { ApiProperty } from '@nestjs/swagger';

export class createAssociateResource {
  @ApiProperty()
  cpf: string;
  @ApiProperty()
  name: string;
}
