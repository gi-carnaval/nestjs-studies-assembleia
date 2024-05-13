import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Pauta {
  @PrimaryGeneratedColumn()
  id?: string;

  @Column({ name: 'description' })
  descricao: string;

  @CreateDateColumn({ name: 'register_date' })
  dataCadastro?: Date;

  @Column({ name: 'opening_date', type: 'timestamp', nullable: true })
  abertura?: Date;

  @Column({ name: 'closure_date', type: 'timestamp', nullable: true })
  fechamento?: Date;

  obterStatus(): string {
    return 'Sem Status';
  }
}
