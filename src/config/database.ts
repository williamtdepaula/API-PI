import _knex from "knex"; // npm install knex --save
import {attachPaginate} from 'knex-paginate'
attachPaginate()
let knex = _knex({
    client: "mysql",
    connection: {
        host: "127.0.0.1",
        database: 'PI_UNIVESP-2021',
        user: 'root',
        password: 'root'
    },
});

export default knex
