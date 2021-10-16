import { Request } from "express";
import { IWithPagination } from "knex-paginate";
import { GroupRisk, UBS } from "./GroupRiskAndUBS";
import { Person } from "./Person";

interface SearchBody {
    max: number;
    current_page: number;
    nomeOuCPF?: string;
    UBSs?: string;
    grupos_risco?: string;
    generos?: string;
}

interface PersonToSaveBody extends Omit<Person, "UBS" | "grupo_risco"> {
    UBS_idUBS?: number;
    grupos_risco: string[];
}

interface CustomRequest<T> extends Request {
    body: T
}

type ResponseFromAPI<T> = IWithPagination<T>

interface ResponseGrupoRiskAndUBS {
    grupo_de_risco: GroupRisk[];
    UBSs: UBS[]
}

interface ErrorQuery  {
    code: string
    errno: number,
    sqlMessage: string,
    sqlState: string,
    index: number,
    sql: string
}

export { SearchBody, PersonToSaveBody, CustomRequest, ResponseFromAPI, ErrorQuery, ResponseGrupoRiskAndUBS }