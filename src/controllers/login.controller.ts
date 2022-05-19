import { Request, Response } from 'express'
import db from '../config/database'
import bcrypt from 'bcrypt';
import { table_UBS } from '../config/tables';
import { ResponseLogin } from '../models/Request';
/*
API para checar se o login está correto

Retorna um objeto do tipo Bool
*/
export async function login(req: Request, res: Response): Promise<Response<ResponseLogin> | void> {
    let {id_ubs, password} = req.body

    try {
        const UBS_DB: ResponseLogin & { password: string } = (await db(table_UBS).select('idUBS', 'CNES', 'nome', 'password', 'isADM', 'address').where({idUBS: id_ubs}))[0]
        
        bcrypt.compare(password.toString(), UBS_DB.password, function(err, result) {
            if (!err){
                const response: ResponseLogin = {
                    idUBS: id_ubs,
                    nome: UBS_DB.nome,
                    CNES: UBS_DB.CNES,
                    isADM: UBS_DB.isADM ? true : false,
                    address: UBS_DB.address
                } 

                if (result) return res.status(200).send(response)
        
                return res.status(403).send({success: false})
            } 
            return res.status(403).send({success: false})
        });
    }catch(e) {
        return res.status(500).send({ error: true })
    }

}