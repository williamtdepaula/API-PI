import _knex from "knex"; // npm install knex --save
import {attachPaginate} from 'knex-paginate'
attachPaginate()
let knex = _knex({
    client: "mysql",
    connection: {
        host: process.env.MYSQL_HOST,
        database: process.env.MYSQL_DATABASE,
        user: process.env.MYSQL_USER,
        password: process.env.MYSQL_PASSWORD
    },
});

export default knex
