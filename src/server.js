/*
========================================================
DEVOPS NOTEBOOK — SERVER ENTRY POINT
========================================================

app.js
    ↓
Contains application configuration/routes

server.js
    ↓
Starts the HTTP server

Keeping these separate makes automated testing easier.

========================================================
*/

import app from './app.js';
import connectDB from './config/db.js';
import { connectRedis } from './config/redis.js';


const PORT = process.env.PORT || 5000;

const startServer = async () => {
    await connectDB();
    await connectRedis();

    app.listen(PORT, () => {
        console.log(`Server running on port: ${PORT}`);
    });
};

startServer();