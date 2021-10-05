import { Response } from 'express'
import db from '../config/database'
import Person from '../models/Person'
import { CustomRequest, ResponseFromAPI, SearchBody } from '../models/Request';

export async function getPeople(req: CustomRequest<SearchBody>, res: Response): Promise<Response> {
    const { minimum, current_page, nome, ubs, grupo_risco, genero, idade } = req.body

    const response: ResponseFromAPI<Person> = await db.select(
        'p.CPF',
        'p.nome',
        'p.endereco',
        'p.idade',
        'p.telefone',
        'p.nascimento',
        'p.email',
        'p.genero',
        'p.horario_contato',
        'p.observacoes',
        'ubs.nome AS UBS',
        'gr.descricao AS grupo_risco',
    )
        .from('pessoa AS p')
        .leftJoin("pessoa_grupo AS pg", "p.CPF", "pg.CPF")
        .leftJoin("GrupoRisco AS gr", "pg.GrupoRisco", "gr.idGrupoRisco")
        .innerJoin("UBS AS ubs", "ubs.idUBS", "p.UBS_idUBS")
        .where((qb) => {
            if (nome) {
                qb.where('p.nome', 'like', `%${nome}%`);
            }
            if (ubs) {
                qb.where('p.UBS_idUBS', '=', `${ubs}`);
            }
            if (grupo_risco) {
                qb.where('pg.GrupoRisco', '=', `${grupo_risco}`);
            }
            if (genero) {
                qb.where('p.genero', '=', `${genero}`);
            }
            if (idade) {
                qb.where('p.idade', '=', `${idade}`);
            }
        }).paginate({
            perPage: minimum,
            currentPage: current_page,
        });

    return res.status(200).send(response)
}