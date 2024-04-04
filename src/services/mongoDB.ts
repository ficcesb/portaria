import { MongoClient } from "mongodb";

const url = process.env.MONGODB_URL_CONNECTION;

export class MongoDB {
  static con: MongoClient;

  public static async getConnection() {
    if(url && !this.con) {
      const mongoDB = new MongoClient(url);
      
      this.con = await mongoDB.connect()
    }
    
    return this.con;
  }
}