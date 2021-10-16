import { Request, Response } from 'express'
import db from '../config/database'
import { table_grupo_risco, table_pessoa, table_pessoa_grupo, table_UBS } from '../config/tables';
import { Person } from '../models/Person'
import { CustomRequest, ErrorQuery, PersonToSaveBody, ResponseFromAPI, SearchBody } from '../models/Request';
import { maskRemoveAllSpecialCharacters } from '../resources/masks';
import { stringHasOnlyNumbers } from '../resources/validations';
/*

API para salvar uma pessoa no banco de dados

Primeiro é feito um INSERT na tabela "pessoa"
Depois é feito um INSERT na table "pessoa_grupo", para relacionar a pessoa com o grupo de risco dela

*/
export async function savePerson(req: CustomRequest<PersonToSaveBody>, res: Response): Promise<Response> {
    try {

        const { CPF, nome, endereco, genero, nascimento, telefone, UBS_idUBS, grupos_risco, email, horario_contato, observacoes } = req.body;

        await db(table_pessoa)
            .insert({
                CPF,
                nome,
                endereco,
                genero,
                nascimento,
                telefone,
                UBS_idUBS,
                email,
                horario_contato,
                observacoes,
            }).then((_) => {
                const inputs: { CPF: string, GrupoRisco: string }[] = []

                grupos_risco.forEach(idGrupoRisco => {
                    inputs.push({
                        CPF,
                        GrupoRisco: idGrupoRisco,
                    })
                })

                return db(table_pessoa_grupo)
                    .insert(inputs)
            });

        return res.status(201).send("success")
    } catch (err) {
        console.log("err", err)
        const e = err as ErrorQuery
        if (e.code == "ER_DUP_ENTRY") {
            return res.status(409).send({ error: true, message: err })
        }
        return res.status(500).send({ error: true, message: err })
    }
}

/*

API para obter pessoas

A API aceita diversos filtros: nome, UBS, grupo de risco, gênero e idade

A API também possui paginação, onde "minimum" é o mínimo de itens por página

*/
export async function getPeople(req: Request, res: Response): Promise<Response> {
    try {

        const { max, current_page, nomeOuCPF, UBSs, grupos_risco, generos } = (req.query) as unknown as SearchBody;

        console.log("ubsss", {
            nomeOuCPF, UBSs, grupos_risco, generos
        })

        const response: ResponseFromAPI<Person> = await db.select(
            'p.CPF',
            'p.nome',
            'p.endereco',
            'p.telefone',
            'p.nascimento',
            'p.email',
            'p.genero',
            'p.horario_contato',
            'p.observacoes',
            'ubs.nome AS UBS',
            db.raw('group_concat(gr.descricao) AS grupo_risco'),
        )
            .from(`${table_pessoa} AS p`)
            .leftJoin(`${table_pessoa_grupo} AS pg`, "p.CPF", "pg.CPF")
            .leftJoin(`${table_grupo_risco} AS gr`, "pg.GrupoRisco", "gr.idGrupoRisco")
            .innerJoin(`${table_UBS} AS ubs`, "ubs.idUBS", "p.UBS_idUBS")
            .groupBy('p.CPF',
                'p.nome',
                'p.endereco',
                'p.telefone',
                'p.nascimento',
                'p.email',
                'p.genero',
                'p.horario_contato',
                'p.observacoes',
                'ubs.nome'
            )
            .where((qb) => {
                if (nomeOuCPF) {
                    let isCPF = stringHasOnlyNumbers(maskRemoveAllSpecialCharacters(nomeOuCPF));

                    if (isCPF) {
                        qb.where('p.CPF', 'like', `%${maskRemoveAllSpecialCharacters(nomeOuCPF)}%`);
                    } else {
                        qb.where('p.nome', 'like', `%${nomeOuCPF}%`);
                    }
                }
                if (UBSs) {
                    let UBSsArr = UBSs.split(",")

                    qb.whereIn('p.UBS_idUBS', UBSsArr);
                }
                if (grupos_risco) {
                    let grupos_risco_arr = grupos_risco.split(",")
                    qb.whereIn("pg.GrupoRisco", grupos_risco_arr)
                }
                if (generos) {
                    let genArr = generos.split(",")
                    qb.whereIn("p.genero", genArr)
                }
            }).paginate({
                perPage: max,
                currentPage: current_page,
                isLengthAware: true
            });


        if (response.data.length == 0) return res.status(404).send(response)

        return res.status(200).send(response);
    } catch (err) {
        return res.status(500).send({ error: true })
    }
}