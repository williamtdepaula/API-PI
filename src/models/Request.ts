import { Request } from "express";
import { IWithPagination } from "knex-paginate";
import { Person } from "./Person";

interface SearchBody {
    minimum: number;
    current_page: number;
    nome?: string;
    ubs?: number;
    grupo_risco?: number;
    genero?: string;
    idade?: number;
}

interface PersonToSaveBody extends Omit<Person, "UBS" | "grupo_risco"> {
    UBS_idUBS?: number;
    idGrupoRisco?: number;
}

interface CustomRequest<T> extends Request {
    body: T
}

type ResponseFromAPI<T> = IWithPagination<T>

interface ErrorQuery  {
    code: string
    errno: number,
    sqlMessage: string,
    sqlState: string,
    index: number,
    sql: string
}

export { SearchBody, PersonToSaveBody, CustomRequest, ResponseFromAPI, ErrorQuery }