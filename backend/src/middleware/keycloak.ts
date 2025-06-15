import express, {Request, Response} from "express";
import {Token} from "keycloak-connect";
const USER_ROLE = process.env.USER_ROLE;
const ADMIN_ROLE = process.env.ADMIN_ROLE;

const session = require("express-session");
const Keycloak = require("keycloak-connect");

const kcConfig = {
    clientId: process.env.KEYCLOAK_CLIENT_ID,
    bearerOnly: true,
    serverUrl: process.env.KEYCLOAK_URL,
    realm: process.env.KEYCLOAK_REALM
};

const memoryStore = new session.MemoryStore();

Keycloak.prototype.accessDenied = function (request: Request, response: Response) {
    response.status(401)
    response.setHeader('Content-Type', 'application/json')
    response.end(JSON.stringify({ status: 401, message: 'Unauthorized/Forbidden', result: { errorCode: 'ERR-401', errorMessage: 'Unauthorized/Forbidden' } }))
}

const keycloak = new Keycloak({ store: memoryStore }, kcConfig);

function adminOnly(token: Token, request: Request) {
    return token.hasRole(`realm:${ADMIN_ROLE}`);
}

function isAuthenticated(token: Token, request: Request) {
    return token.hasRole(`realm:${ADMIN_ROLE}`) || token.hasRole(`realm:${USER_ROLE}`);
}

export { keycloak, isAuthenticated, adminOnly, memoryStore };