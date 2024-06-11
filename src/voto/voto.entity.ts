import { Pauta } from 'src/pautas/pauta.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Associado } from '../associado/associado.entity';

@Entity()
export class Voto {
  @PrimaryGeneratedColumn()
  id?: string;

  @ManyToOne(() => Pauta)
  @JoinColumn({ name: 'id_pauta' })
  pauta: Pauta;

  @ManyToOne(() => Associado)
  @JoinColumn({ name: 'id_associado' })
  associado: Associado;

  @Column({ name: 'vote' })
  voteOption: VoteOption;
}

export enum VoteOption {
  SIM = 'SIM',
  NAO = 'NÃO',
}
