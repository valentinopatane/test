import Knex from 'knex'


class SQL{
    constructor(config,tableName){
        this.knex = Knex(config);
        this.tableName = tableName;
    }


    async add(object){
      try {
          return this.knex(this.tableName).insert(object)
        } catch (error) {
          console.log(error)
        }
    }
    async getById(id) {
      try {
          return this.knex(this.tableName).select('*').where({ id: id })
        } catch (error) {
          console.log(error)
        }
    }
    async getAll() {
      try {
        return this.knex(this.tableName).select('*')
      }catch (error) {
        console.log(error)
      }
    }
    async editById(id, field, data) {
        try {
          return this.knex.from(this.tableName).where('id', id).update(field, data)
        } catch (error) {
          console.log(error)
        }
    }
    async deleteById(id) {
        try {
          return this.knex.from(this.tableName).where('id', id).del()
        } catch (error) {
          console.log(error)
        }
    }
    async deleteAll() {
        try {
          return this.knex.from(this.tableName).del()
        } catch (error) {
          console.log(error)
        }
    }
}

export default SQL