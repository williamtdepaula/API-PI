import { Request, Response } from 'express'
import db from '../config/database'
import bcrypt from 'bcrypt';
import { table_UBS } from '../config/tables';
/*
API para checar se o login está correto

Retorna um objeto do tipo Bool
*/
export async function login(req: Request, res: Response): Promise<Response | void> {
    let {id_ubs, password} = req.body

    try {
        const ubs_password_hash = (await db(table_UBS).select('password').where({idUBS: id_ubs})).map(Object.values)[0][0];

        bcrypt.compare(password.toString(), ubs_password_hash, function(err, result) {
            if (!err){
                if (result) return res.status(200).send({success: true})
        
                return res.status(403).send({success: false})
            } 
            return res.status(403).send({success: false})
        });
    }catch(e) {
        return res.status(500).send({ error: true })
    }

}