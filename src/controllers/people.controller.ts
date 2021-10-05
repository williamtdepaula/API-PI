import { Response } from 'express'
import db from '../config/database'
import { table_grupo_risco, table_pessoa, table_pessoa_grupo, table_UBS } from '../config/tables';
import { Person } from '../models/Person'
import { CustomRequest, PersonToSaveBody, ResponseFromAPI, SearchBody } from '../models/Request';

/*

API para salvar uma pessoa no banco de dados

Primeiro é feito um INSERT na tabela "pessoa"
Depois é feito um INSERT na table "pessoa_grupo", para relacionar a pessoa com o grupo de risco dela

*/
export async function savePerson(req: CustomRequest<PersonToSaveBody>, res: Response): Promise<Response> {
    const {CPF, nome, endereco, genero, idade, nascimento, telefone, UBS_idUBS, idGrupoRisco, email, horario_contato, observacoes} = req.body;

    await db(table_pessoa)
        .insert({
            CPF,
            nome,
            endereco,
            genero,
            idade,
            nascimento,
            telefone,
            UBS_idUBS,
            email,
            horario_contato,
            observacoes,
        }).then((_) => 
            db(table_pessoa_grupo)
            .insert({
                CPF,
                GrupoRisco: idGrupoRisco
            })
        );

    return res.status(200).send("success");
}

/*

API para obter pessoas

A API aceita diversos filtros: nome, UBS, grupo de risco, gênero e idade

A API também possui paginação, onde "minimum" é o mínimo de itens por página

*/
export async function getPeople(req: CustomRequest<SearchBody>, res: Response): Promise<Response> {
    const { minimum, current_page, nome, ubs, grupo_risco, genero, idade } = req.body;

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
        .from(`${table_pessoa} AS p`)
        .leftJoin(`${table_pessoa_grupo} AS pg`, "p.CPF", "pg.CPF")
        .leftJoin(`${table_grupo_risco} AS gr`, "pg.GrupoRisco", "gr.idGrupoRisco")
        .innerJoin(`${table_UBS} AS ubs`, "ubs.idUBS", "p.UBS_idUBS")
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

    return res.status(200).send(response);
}