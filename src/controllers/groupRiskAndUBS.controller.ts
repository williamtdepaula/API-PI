import { Request, Response } from 'express'
import db from '../config/database'
import { table_grupo_risco, table_UBS } from '../config/tables';
import { ResponseGrupoRiskAndUBS } from '../models/Request';

/*
API que retorna todos os grupos de risco e UBSs cadastradas no banco de dados

Retorna um objeto do tipo ResponseGrupoRiskAndUBS
*/
export async function getGroupRiskAndUBS(req: Request, res: Response): Promise<Response<ResponseGrupoRiskAndUBS>> {
    try {
        const response: ResponseGrupoRiskAndUBS = await db.select("*")
        .from(table_grupo_risco)
        .then(async res => {
            let UBSs = await db.select('*')
            .from(table_UBS)

            let response: ResponseGrupoRiskAndUBS = {
                grupo_de_risco: res,
                UBSs
            }

            return response
        })
        return res.status(200).send(response);
    } catch (err) {
        return res.status(500).send({ error: true })
    }
}
