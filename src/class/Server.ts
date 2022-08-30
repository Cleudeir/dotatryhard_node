import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv';
dotenv.config();

class Server {
    public express: express.Application

    public constructor() {
        this.express = express()
        this.middlewares()
    }
    private middlewares() {
        this.express.use(express.json())
        this.express.use(cors())
        this.express.listen(process.env.PORT_EXPRESS || 3334, () => {
            console.log(`iniciados na porta ${process.env.PORT_EXPRESS || 3334}`)
        })
    }
}
export default new Server().express