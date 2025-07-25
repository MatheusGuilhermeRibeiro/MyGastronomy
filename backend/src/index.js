import express from 'express';
import cors from 'cors';
import { Mongo } from './database/mongo.js'
import { config } from "dotenv";
import authRouter from './auth/auth.js';
import usersRouter from "./routes/users.js";
import platesRouter from "./routes/plates.js";
import ordersRouter from "./routes/orders.js";

config()

async function main () {
    const hostname = 'localhost';
    const port = process.env.PORT || 3000;

    const app = express();

    const mongoConnection = await Mongo.connect({ mongoConnectionString: process.env.MONGO_CONNECTION_STRING, mongoDbName: process.env.MONGO_DBNAME });
    console.log(mongoConnection);

    app.use(express.json());
    app.use(cors());

    app.get('/', function (req, res) {
        res.send({
            success: true,
            statusCode: 200,
            body: "Welcome to MyGastronomy"
        })
    })

    app.use('/auth', authRouter)
    app.use('/users', usersRouter)
    app.use('/plates', platesRouter)
    app.use('/orders', ordersRouter)
    app.listen(port, () => {
        console.log(`Listening on port https://${hostname}:${port}`);
    })
}

main()