import { Inject, Injectable } from '@nestjs/common';
import { Associado } from './associado.entity';
import { Repository } from 'typeorm';
import { HttpError } from 'src/common/httpError';
import { Result } from 'src/common/result';

@Injectable()
export class AssociadoService {
  constructor(
    @Inject('ASSOCIADO_REPOSITORY')
    private readonly associadoRepository: Repository<Associado>,
  ) {}

  async obterPorCpf(cpf: string): Promise<Associado> {
    return await this.associadoRepository.findOne({
      where: { cpf: cpf },
    });
  }

  async getAll(): Promise<Associado[]> {
    return await this.associadoRepository.find();
  }

  async getById(id: string): Promise<Associado> {
    return await this.associadoRepository.findOne({
      where: { id: id },
    });
  }

  async updateById(id: string, cpf: string, name: string) {
    await this.associadoRepository.update(
      {
        id: id,
      },
      {
        cpf: cpf,
        name: name,
      },
    );
  }

  async createAssociate(
    cpf: string,
    name: string,
  ): Promise<Result<Associado, HttpError>> {
    const associate = await this.associadoRepository.save({
      cpf: cpf,
      name: name,
    });

    return new Result(associate, null);
  }

  async verifyAssociateByCpf(cpf: string): Promise<Associado> {
    const associadoEncontrado: Associado = await this.obterPorCpf(cpf);

    if (associadoEncontrado) {
      return associadoEncontrado;
    }
  }
}
