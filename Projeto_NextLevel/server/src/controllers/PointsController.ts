import {Request, Response} from 'express';
import knex from '../database/connection'
class PointsController {

    async index(request:Request, response:Response){
        const {city, uf, items} = request.query

        const parsedItems = String(items).split(',').
        map(item => Number(item.trim()));

        const points = await knex('points')
        .join('point_items', 'points.id', '=', 'point_items.point_id')
        .whereIn('point_items.item_id', parsedItems)
        .where('city',String(city))
        .where('uf', String(uf))
        .distinct()
        .select('points.*')

        
        
        return response.json(points);
    }

    async show(request: Request, response: Response){
        const {id} = request.params;
        const point = await knex('points').where('id', id).first();

        if(!point){
            return response.status(400).json({ message: 'Point not find'});
        }

        const items = await knex('items')
        .join('point_items', 'items.id', '=', 'point_items.item_id')
        .where('point_items.point_id', id);

        return response.json({point, items});
    }

    async create(request: Request, response: Response){
        const  {
            name,
            email,
            whatsapp,
            latitude,
            logitude,
            city,
            uf,
            items
    } = request.body

    const tsx = await knex.transaction();

    const point = {
            image: 'https://images.unsplash.com/photo-1556767576-5ec41e3239ea?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=400&q=60',
            name,
            email,
            whatsapp,
            latitude,
            logitude,
            city,
            uf,
    }

   const insertedIds= await tsx('points').insert(point)

    const point_id = insertedIds[0];

    const pointItems = items.map((item_id: number) =>{
        return {
            item_id,
            point_id,
        }
    })

    try{
    await tsx('point_items').insert(pointItems);

    await tsx.commit();

    }catch (error){
        await tsx.rollback();
    
    return response.status(400).json({ message: 'Falha na inserção na tabela point_items, verifique se os items informados são válidos' })
    }
    return response.json({ id: point_id, ...point, })
}
}
export default PointsController;