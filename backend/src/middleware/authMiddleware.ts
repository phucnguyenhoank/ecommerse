import { Request, Response, NextFunction } from 'express';
import {jwtDecode}from 'jwt-decode';
import {User} from "../entity/User";
import { AppDataSource } from "../config/datasource";

interface KeycloakTokenResponse {
    access_token: string;
    expires_in: number;
    refresh_token?: string;
    token_type: string;
}

interface TokenPayload {
    sub: string;
    realm_access: {
        roles: string[];
    };
}
export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { username, password } = req.body;
        if (!username || !password) {
            res.status(400).json({ message: 'Username and password are required' });
        }
        else{
            const tokenUrl = 'http://localhost:8080/realms/ecommserse/protocol/openid-connect/token';
            const body = new URLSearchParams({
                grant_type: 'password',
                client_id: 'express-api', // Replace with your actual client_id
                // client_secret: 'your-client-secret', // Replace with your actual client_secret
                username,
                password,
            });
            const response = await fetch(tokenUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: body.toString(),
            });
            if (!response.ok) {
                if (response.status === 401) {
                    res.status(401).json({ message: 'Invalid username or password' });
                }
                throw new Error(`Keycloak request failed with status ${response.status}`);
            }
            else{
                const data: KeycloakTokenResponse = await response.json();
                const accessToken = data.access_token;
                if (!accessToken) {
                    res.status(401).json({ message: 'Failed to obtain access token' });
                }
                else{
                    const decodedToken: TokenPayload = jwtDecode(accessToken);
                    const keycloakId = decodedToken.sub;
                    const roles = decodedToken.realm_access?.roles || [];
                    if (!roles.includes('admin') && !roles.includes('user')) {
                        res.status(403).json({ message: 'Access denied: User or admin role required' });
                    }
                    else{
                        const userRepository = AppDataSource.getRepository(User);
                        const user = await userRepository.findOneBy({ keycloakId });

                        if (!user) {
                            res.status(404).json({ message: 'User not found in database' });
                        }
                        else{
                            req.auth = {
                                token: accessToken,
                                roles,
                                user,
                            };
                        }
                    }
                }
            }
        }
    } catch (error: any) {
        console.error('Authentication error:', error.message);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

declare global {
    namespace Express {
        interface Request {
            auth?: {
                token: string;
                roles: string[];
                user: User;
            };
        }
    }
}