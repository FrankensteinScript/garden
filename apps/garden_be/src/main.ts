import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import router from './routes';
import { AppDataSource } from './data-source';
import { Plant } from './entity/Plant';

const app = new Koa();

app.use(bodyParser());
app.use(router.routes());
app.use(router.allowedMethods());

AppDataSource.initialize()
    .then(async () => {
        console.log('Database connected');

        const repo = AppDataSource.getRepository(Plant);
        const count = await repo.count();

        if (count === 0) {
            console.log('Seeding plants...');
            const plants = repo.create([
                { name: 'Bazalka' },
                { name: 'Máta' },
                { name: 'Rozmarýn' },
            ]);
            await repo.save(plants);
            console.log('Plants seeded successfully!');
        }

        app.listen(3000, () =>
            console.log('Server running on http://localhost:3000')
        );
    })
    .catch((error) => console.error('Database connection failed:', error));
