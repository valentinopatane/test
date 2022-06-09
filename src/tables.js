import knex from 'knex'

import template from './data/template.js'

//----------------Products Table----------------//
import configMySql from './config/configMySql.js'
const mySqlClient = knex(configMySql)


//----------------Products Table----------------//

mySqlClient.schema.hasTable('products')

.then((exists) => {
        if (!exists) {
            mySqlClient.schema.createTable('products', (table) => {
                table.increments('id'),
                table.string('name'),
                table.string('description'),
                table.float('price'),
                table.integer('stock'),
                table.string('thumbnail')
              }).then(()=>{
                template.forEach(product =>{
                    return mySqlClient('products').insert(product) 
                }) 
              }).then(()=>{
                console.log('"Products" Table created!')
              })
              

            }else{
                console.log('Products table already exists')
            }
        })

.finally(() => {
    mySqlClient.destroy()
})
