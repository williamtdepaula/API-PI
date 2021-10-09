import express, { Application } from 'express'
import morgan from 'morgan'
import IndexRoute from './routes/index.route';
import PeopleRoute from './routes/people.route';
import GroupRiskAndUBSRoute from './routes/groupRiskAndUBS.route';

export class App {
    app: Application;

    constructor(
        private port?: number | string
    ) {
        this.app = express();
        this.settings();
        this.middlewares();
        this.routes();
    }

    private settings() {
        this.app.set('port', this.port || process.env.PORT || 3000);
    }

    private middlewares() {
        this.app.use(morgan('dev'));
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: false }))
    }

    private routes() {
        this.app.use(IndexRoute);
        this.app.use(PeopleRoute);
        this.app.use(GroupRiskAndUBSRoute);
    }

    async listen(): Promise<void> {
        await this.app.listen(this.app.get('port'));
        console.log('Server on port', this.app.get('port'));
    }

}