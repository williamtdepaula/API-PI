import { Request } from "express";
import { IWithPagination } from "knex-paginate";

interface SearchBody {
    minimum: number;
    current_page: number;
    nome?: string;
    ubs?: number;
    grupo_risco?: number;
    genero?: string;
    idade?: number;
}

interface CustomRequest<T> extends Request {
    body: T
}

type ResponseFromAPI<T> = IWithPagination<T>

export { SearchBody, CustomRequest, ResponseFromAPI }