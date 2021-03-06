import { createConnection, getConnection, Connection } from "typeorm";

import ormconfig from "./ormconfig";


const connection = {
  async create(): Promise<Connection> {
    try {
      const config = await ormconfig();
      return await createConnection(config);
    } catch (err) {
      throw err;
    }
  },

  async close() {
    return await getConnection().close();
  },

  async clear() {
    const connection = getConnection();
    const entities = connection.entityMetadatas;

    entities.forEach(async (entity) => {
      const repository = connection.getRepository(entity.name);
      await repository.query(`DELETE FROM ${entity.tableName}`);
    });
  },
};

export default connection;
