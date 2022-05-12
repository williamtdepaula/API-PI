import { Request, Response } from 'express'
import db from '../config/database'
import { table_grupo_risco, table_UBS } from '../config/tables';
import { ResponseGrupoRiskAndUBS } from '../models/Request';
import bcrypt from 'bcrypt';
import { UBS } from '../models/GroupRiskAndUBS';
/*
API que retorna todos os grupos de risco e UBSs cadastradas no banco de dados

Retorna um objeto do tipo ResponseGrupoRiskAndUBS
*/
export async function getGroupRiskAndUBS(req: Request, res: Response): Promise<Response<ResponseGrupoRiskAndUBS>> {
    try {
        const response: ResponseGrupoRiskAndUBS = await db.select("*")
        .from(table_grupo_risco)
        .then(async res => {
            let UBSs = await db.select('idUBS', 'CNES', 'nome', 'isADM')
            .from(table_UBS)
            .whereNot('isADM', 1)

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

export async function getUBSs(req: Request, res: Response): Promise<Response<UBS[]>> {
    const { includesADM } = (req.query);

    try {
        
        let UBSs: UBS[] 

        if (includesADM){
            UBSs = await db.select('idUBS', 'CNES', 'nome', 'isADM')
            .from(table_UBS)
        } else {
            UBSs = await db.select('idUBS', 'CNES', 'nome', 'isADM')
            .from(table_UBS)
            .whereNot('isADM', 1)
        }


        return res.status(200).send(UBSs);
    } catch (err) {
        return res.status(500).send({ error: true })
    }
}