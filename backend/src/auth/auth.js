import express from "express";
import passport from "passport";
import LocalStrategy from "passport-local";
import crypto from "crypto";
import { Mongo } from "../database/mongo.js";
import jwt from "jsonwebtoken";
import { ObjectId } from "mongodb";

const collectionName = 'users';


passport.use(new LocalStrategy({ usernameField: 'email' }, async (email, password, callback) => {
    try {
        const user = await Mongo.db
            .collection(collectionName)
            .findOne({ email });

        if (!user) {
            return callback(null, false);
        }

    const saltBuffer = user.salt.buffer

    crypto.pbkdf2(password, saltBuffer, 310000, 16, 'sha256', (err, hashedPassword) => {
        if (err) {
            return callback(null, false);
        }

        const userPasswordBuffer = Buffer.from(user.password.buffer)

        if (!crypto.timingSafeEqual(userPasswordBuffer, hashedPassword)) {
            return callback(null, false);
        }

            const { password, salt, ...rest } = user;

            return callback(null, rest);
        });
    } catch (error) {
        return callback(error);
    }
}));

const authRouter = express.Router();

authRouter.post('/signup', async (req, res) => {
    const { email, password } = req.body || {};

    if (!email || !password) {
        return res.status(400).send({
            success: false,
            statusCode: 400,
            body: {
                text: "Missing email or password"
            }
        });
    }

    try {
        const checkUser = await Mongo.db
            .collection(collectionName)
            .findOne({ email });

        if (checkUser) {
            return res.status(409).send({
                success: false,
                statusCode: 409,
                body: {
                    text: "User already exists"
                }
            });
        }

        const salt = crypto.randomBytes(16);

        crypto.pbkdf2(password, salt, 310000, 16, 'sha256', async (err, hashedPassword) => {
            if (err) {
                return res.status(500).send({
                    success: false,
                    statusCode: 500,
                    body: {
                        text: "Error on crypto password!",
                        err: err.message
                    }
                });
            }

            const result = await Mongo.db
                .collection(collectionName)
                .insertOne({
                    email,
                    password: hashedPassword,
                    salt
                });

            if (result.insertedId) {
                const user = await Mongo.db
                    .collection(collectionName)
                    .findOne({ _id: new ObjectId(result.insertedId) });

                const token = jwt.sign(user, 'secret');

                return res.status(201).send({
                    success: true,
                    statusCode: 201,
                    body: {
                        text: 'User registered successfully!',
                        token,
                        user,
                        logged: true,
                    }
                });
            } else {
                return res.status(500).send({
                    success: false,
                    statusCode: 500,
                    body: {
                        text: "Failed to register user"
                    }
                });
            }
        });
    } catch (err) {
        return res.status(500).send({
            success: false,
            statusCode: 500,
            body: {
                text: "Internal server error",
                err: err.message
            }
        });
    }
});

authRouter.post('/login', (req, res) => {
    passport.authenticate('local', (error, user) => {
        if (error) {
            return res.status(500).send({
                success: false,
                statusCode: 500,
                body: {
                    text: "Error during authentication",
                    error: error
                }
            });
        }

        if (!user) {
            return res.status(400).send({
                success: false,
                statusCode: 400,
                body: {
                    text: "Credentials not correctly",
                }
            });
        }

        const token = jwt.sign(user, 'secret');
        return res.status(200).send({
            success: true,
            statusCode: 200,
            body: {
                text: "User logged in correctly",
                user,
                token,
            }
        });
    })(req, res);
})

export default authRouter;