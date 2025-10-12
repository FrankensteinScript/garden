import Router from 'koa-router';
import { AppDataSource } from '../data-source';
import { Plant } from '../entity/Plant';

const router = new Router();

router.get('/', async (ctx) => {
    const name = ctx.query.name || 'Tomku';
    ctx.body = { message: `Hello, ${name}!` };
});

router.get('/garden', async (ctx) => {
    const name = ctx.query.name || 'Tomku';
    ctx.body = { message: `Jdem na to, ${name}!` };
});

router.get('/plants', async (ctx) => {
    const repo = AppDataSource.getRepository(Plant);
    const plants = await repo.find();
    ctx.body = plants;
});

router.post('/plants', async (ctx) => {
    const repo = AppDataSource.getRepository(Plant);
    const newPlant = repo.create({ name: 'Bazalka' });
    await repo.save(newPlant);
    ctx.body = newPlant;
});

export default router;
