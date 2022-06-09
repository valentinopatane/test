import mongoose from 'mongoose'
import config from '../config/configMongo.js'

//-------------------- MONGOOSE CONNECTION--------------------//

try {
    mongoose.connect(config.cnxStr, config.options, () => console.log('Mongoose is connected'))
} catch (error) {
  console.log('Unable to connect')
}

const dbConnection = mongoose.connection
dbConnection.on('error', (err) => console.log(`Connection error: ${err}`))
dbConnection.once('open', () => console.log('Connected to database'))


//--------------------CLASS--------------------//
class MongoClass {
  constructor(collectionName, schema) {
    this.collection = mongoose.model(collectionName, schema)
  }

  async getAll() {
    try {
      const objs = await this.collection.find().lean()
      return objs
    } catch (error) {
      console.log(error)
    }
  }

  async add(object) {
    try {
      await this.collection.create(object);

    } catch (error) {
      console.log(`ERROR: ${error}`)
    }
  }
}

export default MongoClass