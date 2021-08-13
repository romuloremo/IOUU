import fs from 'fs';
import csv from 'csv-parser';
import {MongoClient} from "mongodb";

const url = `mongodb+srv://romulo:xavier12@cluster0.b09iz.mongodb.net/IOUU?retryWrites=true&w=majority`
const client = new MongoClient(url)

async function main(dbName, data) {
    await client.connect()
    console.log('Connected successfully to server')
    const db = client.db(dbName)
    const collection = db.collection('professions')
    const insertResult = await collection.insertMany(data)
    return 'OK'
}

function generateSqlfromCsv(csvFile) {
    let results = [];
    fs.createReadStream(`${csvFile}.csv`)
    .pipe(csv({ separator: "," }))
    .on("data", (data) => {
        results.push({
            name: JSON.parse(JSON.stringify(data)).Nome,
            value: JSON.parse(JSON.stringify(data)).Valor,
            create_at: new Date()
        })
    }).on("end", () => {
        main("IOUU", results)
        .then(console.log)
        .catch(console.error)
        .finally(() => client.close())
    });
}
  
generateSqlfromCsv("data");
