// import {Request, Response} from "express";
//
// const Keycloak = require("keycloak-connect");
// const session = require("express-session");
// const USER_ROLE = 'user';
// const ADMIN_ROLE = 'admin';
//
// const kcConfig = {
//     clientId: 'express-api',
//     bearerOnly: true,
//     serverUrl: process.env.AUTH_SERVER || 'http://localhost:8080',
//     realm: process.env.AUTH_REALM || 'ecommserse'
// };
//
// export const memoryStore = new session.MemoryStore();
//
// Keycloak.prototype.accessDenied = function (request: Request, response: Response) {
//     response.status(401)
//     response.setHeader('Content-Type', 'application/json')
//     response.end(JSON.stringify({ status: 401, message: 'Unauthorized/Forbidden', result: { errorCode: 'ERR-401', errorMessage: 'Unauthorized/Forbidden' } }))
// }
//
// export const keycloak = new Keycloak({ store: memoryStore }, kcConfig);

// export default keycloak;