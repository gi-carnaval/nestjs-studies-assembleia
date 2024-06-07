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
    if (this.fechamento && this.fechamento < new Date()) {
      return StatusPauta.ENCERRADA;
    }

    if (this.abertura) {
      return StatusPauta.INICIADA;
    }

    return StatusPauta.NAO_INICIADA;
  }

  public isInitialized(): boolean {
    return this.isInStatus(StatusPauta.INICIADA);
  }
  public isEnded(): boolean {
    return this.isInStatus(StatusPauta.ENCERRADA);
  }
  public isAbbleToInit(): boolean {
    return this.isInStatus(StatusPauta.NAO_INICIADA);
  }

  public isInStatus(verifyStatus: StatusPauta): boolean {
    const status = this.obterStatus();
    return status == verifyStatus;
  }
}

enum StatusPauta {
  NAO_INICIADA = 'Sessão não iniciada',
  INICIADA = 'Sessão iniciada',
  ENCERRADA = 'Sessão Encerrada',
}
