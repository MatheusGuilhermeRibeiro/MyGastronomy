import { Mongo } from "../database/mongo.js"
import { ObjectId } from 'mongodb'

const collectionName = 'orders'

export default class OrdersDataAccess {
    async getOrders() {
        const result = await Mongo.db
            .collection(collectionName)
            .aggregate([
                {
                    $lookup: {
                        from: 'orderItems',
                        localField: '_id',
                        foreignField: 'orderId',
                        as: 'orderItems',
                    }
                },

                {
                    $unwind: '$orderItems',
                },
                {
                    $lookup: {
                        from: 'plates',
                        localField: 'orderItems.plateId',
                        foreignField: '_id',
                        as: 'orderItems.itemDetails',
                    },

                },
                {
                    $group: {
                        _id: '_id',
                        userDetails: { $first: '$userDetails' },
                        orderItems: { $push: '$orderItems' },
                        pickupStatus: { $first: '$pickupStatus' },
                        pickUp: { $first: '$pickUp' },

                    }
                }
            ])
            .toArray()

        return result
    }

    async getOrdersByUserId(userId) {
        const result = await Mongo.db
            .collection(collectionName)
            .aggregate([
                {
                    $match: { userID: userId }
                },
                {
                    $lookup: {
                        from: 'orderItems',
                        localField: '_id',
                        foreignField: 'orderId',
                        as: 'orderItems',
                    }
                },

                {
                    $unwind: '$orderItems',
                },
                {
                    $lookup: {
                        from: 'plates',
                        localField: 'orderItems.plateId',
                        foreignField: '_id',
                        as: 'orderItems.itemDetails',
                    },

                },
                {
                    $group: {
                        _id: '$_id',
                        userDetails: { $first: '$userDetails' },
                        orderItems: { $push: '$orderItems' },
                        pickupStatus: { $first: '$pickupStatus' },
                        pickUp: { $first: '$pickUp' },

                    }
                }
            ])
            .toArray()

        return result
    }

    async addOrders(ordersData) {
        const { items, ...orderDataRest } = ordersData

        orderDataRest.createdAt = new Date();
        orderDataRest.pickupStatus = 'Pending'
        orderDataRest.userId = new ObjectId(orderDataRest.userId)

        const newOrder = await Mongo.db
            .collection(collectionName)
            .insertOne(ordersData)

        if (!newOrder.insertedId) {
            throw new Error('Order cannot be inserted')
        }

        items.map ((item) => {
            item.plateId = new ObjectId(item.plateId)
            item.orderId = new ObjectId(newOrder.insertedId)
         })

        const result = await Mongo.db
        .collection('orderItems')
        .insertMany(items)

        return result
    }

    async deleteOrders (ordersId) {

        const itemsToDelete = await Mongo.db
            .collection( 'orderItems' )
            .deleteMany( { orderId: new ObjectId(ordersId) }, )

        const orderToDelete = await Mongo.db
            .collection(collectionName)
            .findOneAndDelete({ _id: new ObjectId(ordersId) })

        const result = {
            itemsToDelete,
            orderToDelete
        }
        return result
    }

    async updateOrders(ordersId, ordersData) {
        const result = await Mongo.db
            .collection(collectionName)
            .findOneAndUpdate(
                { _id: new ObjectId(ordersId) },
                { $set: ordersData }
            )

        return result
    }

}