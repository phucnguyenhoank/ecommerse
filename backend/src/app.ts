// import express from 'express';
// import session from 'express-session';
// import { keycloak, memoryStore } from './keycloak';
//
// const app = express();
//
// app.use(session({
//     secret: 'lTyYzz3jq8sOmHpyA9NQIdt3BQvCf2MZ',
//     resave: false,
//     saveUninitialized: true,
//     store: memoryStore,
// }));
//
// app.use(keycloak.middleware());
//
//
// app.get('/protected', keycloak.protect(), (req, res) => {
//     res.json({ message: 'Access granted' });
// });
//
//
// app.get('/admin-only', keycloak.protect('realm:admin'), (req, res) => {
//     res.json({ message: 'Admin area' });
// });
//
// app.listen(3001, () => {
//     console.log('API chạy tại http://localhost:3001');
// });
