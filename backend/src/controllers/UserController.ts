import { Request, Response } from "express";

import {UserService} from "../services/UserService";

import qs from 'qs';

const userService = new UserService();

export class UserController {
    static async getAllUsers(req: Request, res: Response) {
        try {
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 10;

            const [users, totalCount] = await userService.getAllUsersWithPagination(page, limit);

            res.json({
                data: users,
                totalCount,
                currentPage: page,
                totalPages: Math.ceil(totalCount / limit)
            });

        } catch (error) {
            res.status(500).json({ message: "Error fetching users", error });
        }
    }
    static async getUserById(req: Request, res: Response) {
        try {
            const user = await userService.getUserById(parseInt(req.params.id));
            if (!user) res.status(404).json({ message: "User not found" });
            else res.json(user);
        } catch (error) {
            res.status(500).json({ message: "Error fetching user", error });
        }
    }
    static async updateUser(req: Request, res: Response) {
        try {
            const updatedUser = await userService.updateUser(parseInt(req.params.id), req.body);
            if (!updatedUser) res.status(404).json({ message: "User not found" });
            else res.json(updatedUser);
        } catch (error) {
            res.status(500).json({ message: "Error updating user", error });
        }
    }
    static async deleteUser(req: Request, res: Response) {
        try {
            const deleted = await userService.deleteUser(parseInt(req.params.id));
            if (!deleted) res.status(404).json({ message: "User not found" });
            else res.status(204).send();
        } catch (error) {
            res.status(500).json({ message: "Error deleting user", error });
        }
    }
    static async addUserAddress(req: Request, res: Response) {
        try {
            const { userId } = req.params;
            const { street_name, city, region, district, country, is_default } = req.body;

            const addressData = { street_name, city, region, district, country };
            const userAddress = await userService.addUserAddress(parseInt(userId), addressData, is_default);

            res.status(201).json(userAddress);
        } catch (error) {
            res.status(500).json({ message: "Error adding address", error });
        }
    }

    static async createUser(req: Request, res: Response) {
        try {

            const user = req.body;
            const {username, password, email, phone} = req.body;
            const tokenResponse = await fetch(
                'http://localhost:8080/realms/ecommserse/protocol/openid-connect/token',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                    body: qs.stringify({
                        grant_type: 'password',
                        client_id: "express-api",
                        username: 'realmadmin',
                        password:'admin',
                    }),
                }
            );
            console.log('tokenresponse:',tokenResponse.status);
            const accessToken = await tokenResponse.json();
            const adminToken = accessToken['access_token'];

            const userInfoResponse = await fetch(
                'http://localhost:8080/admin/realms/ecommserse/users',
                {
                    method: 'POST',
                    headers: {
                        Authorization: `Bearer ${adminToken}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(
                        {
                            "username": username,
                            "email": email,
                            "enabled": true,
                            "credentials": [
                                {
                                    "type": "password",
                                    "value": password,
                                    "temporary": false
                                }
                            ]
                        }
                    ),
                }
            );
            const locationHeader = userInfoResponse.headers.get('Location');
            const keycloakId = locationHeader?.split('/').pop();
            if (!keycloakId) {
                throw new Error('Failed to retrieve Keycloak ID');
            }
            console.log('userinforesponse:', userInfoResponse.status);
            // fetch client id here
            const clientResponse = await fetch(
                `http://localhost:8080/admin/realms/ecommserse/clients?clientId=express-api`,
                {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${adminToken}`,
                        'Content-Type': 'application/json',
                    },
                }
            );
            console.log('Client Response Status:', clientResponse.status);
            if (!clientResponse.ok) {
                console.log('Client Response Error:', await clientResponse.text());
            }
            const clients = await clientResponse.json();
            const client = clients.find((c: any) => c.clientId === 'express-api');
            if (!client) {
                throw new Error('Client not found');
            }
            const clientId = client.id;
            console.log(`Client ID: ${clientId}`);
            // fetch for user role
            const rolesResponse = await fetch(
                `http://localhost:8080/admin/realms/ecommserse/clients/${clientId}/roles`,
                {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${adminToken}`,
                        'Content-Type': 'application/json',
                    },
                }
            );
            const roles = await rolesResponse.json();
            const roleToAssign = roles.find((role: any) => role.name === 'user');
            if (!roleToAssign) {
                throw new Error('Role "user" not found for client express-api');
            }
            // assign role 'user' for new user
            await fetch(
                `http://localhost:8080/admin/realms/ecommserse/users/${keycloakId}/role-mappings/clients/${clientId}`,
                {
                    method: 'POST',
                    headers: {
                        Authorization: `Bearer ${adminToken}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify([
                        {
                            id: roleToAssign.id,
                            name: roleToAssign.name,
                        },
                    ]),
                }
            );
            user.keycloakId = keycloakId;
            const saveUser = await userService.createUser(user);
            res.status(201).json(saveUser);
        } catch (error) {
            res.status(500).json({ message: "Error creating user", error });
        }
    }

    static async getUserCount(req: Request, res: Response) {
  try {
    const count = await userService.countUsers();
    res.json({ count });
  } catch (error) {
    res.status(500).json({ message: "Error counting users", error });
  }
}


    static async getCurrentUser(req: Request, res: Response){
        try {
            if (!req.body) {
                res.status(400).json({ message: 'Request body is missing' });
            }

            const { username, password } = req.body;
            if (!username || !password) {
                res.status(400).json({ message: 'Missing username or password' });
            }
            else{
                const user = await userService.getUserByCredentials(username, password);
                if (!user) {
                    res.status(401).json({ message: 'Invalid credentials' });
                }
                else{
                    const keycloakId = user.keycloakId;
                    if (!keycloakId) {
                        res.status(404).json({ message: 'Keycloak ID not found for user' });
                    }
                    else{
                        try {
                            const tokenResponse = await fetch(
                                'http://localhost:8080/realms/ecommserse/protocol/openid-connect/token',
                                {
                                    method: 'POST',
                                    headers: {
                                        'Content-Type': 'application/x-www-form-urlencoded',
                                    },
                                    body: qs.stringify({
                                        grant_type: 'password',
                                        client_id: "express-api", // Assume client ID is set in env
                                        // client_secret: process.env.KEYCLOAK_CLIENT_SECRET, // Assume client secret is set
                                        username,
                                        password,
                                        scope: 'openid',
                                    }),
                                }
                            );
                            if (!tokenResponse.ok) {

                                throw new Error(`Token endpoint responded with status: ${tokenResponse.status}`);
                            }
                            else{
                                console.log(tokenResponse);
                                const { access_token } = await tokenResponse.json();
                                if (!access_token) {
                                    res.status(401).json({ message: 'Failed to obtain access token' });
                                }
                                else{
                                    const userInfoResponse = await fetch(
                                        'http://localhost:8080/realms/ecommserse/protocol/openid-connect/userinfo',
                                        {
                                            method: 'GET',
                                            headers: {
                                                Authorization: `Bearer ${access_token}`,
                                                'Content-Type': 'application/json',
                                            },
                                        }
                                    );

                                    if (!userInfoResponse.ok) {
                                            res.status(userInfoResponse.status).json({
                                            message: `Failed to fetch userinfo: ${userInfoResponse.statusText}`,
                                        });
                                    }
                                    else{
                                        const userInfo = await userInfoResponse.json();
                                        // res.status(200).json(userInfo);

                                        const clientRoles = userInfo['client_role'] || [];
                                        if (!clientRoles.length) {
                                            res.status(403).json({ message: 'User does not have required roles' });
                                        }
                                        else{
                                            res.json({
                                                ...userInfo
                                            });
                                        }
                                    }
                                }
                            }
                        }
                        catch (error) {
                        console.log(error);
                        }

                    }
                }
            }
        } catch (error) {
            console.error('Error fetching user:', error);
            res.status(500).json({ message: 'Error fetching user', error });
        }
    }


}