import express from "express";
import OrdersController from "../controllers/orders.js";

const ordersRouter = express.Router();

const ordersController = new OrdersController();

ordersRouter.get('/', async (req, res) => {
    const { success,statusCode, body } = await ordersController.getOrders();

    res.status(statusCode).send({success,statusCode, body})
})

ordersRouter.get('/:id', async (req, res) => {
    const { success,statusCode, body } = await ordersController.getOrdersByUserId(req.params.id);

    res.status(statusCode).send({success,statusCode, body})
})

ordersRouter.post('/', async (req, res) => {
    const { success,statusCode, body } = await ordersController.addOrders(req.body);

    res.status(statusCode).send({success,statusCode, body})
})

ordersRouter.delete('/:id', async (req, res) => {
    const { success,statusCode, body } = await ordersController.deleteOrders(req.params.id);

    res.status(statusCode).send({success,statusCode, body})
})

ordersRouter.put('/:id', async (req, res) => {
    const { success,statusCode, body } = await ordersController.updateOrders(req.params.id, req.body);

    res.status(statusCode).send({success,statusCode, body})
})


export default ordersRouter;