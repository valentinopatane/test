import { Router } from 'express';
import { faker } from '@faker-js/faker';

const fakerRouter = Router()

fakerRouter.get('/', (req,res) =>{
    const products = [];
    let product;

    for (let i = 0; i < 5; i++) {
        product = {
            name: faker.commerce.product(),
            price: Number(faker.commerce.price(0, 200, 0)),
            thumbnail: faker.image.food(100, 100)
        }
        products.push(product)
    }

    res.json(products)
})

export default fakerRouter