import express from "express";
import cors from "cors";
import session from "express-session";
import dotenve from "dotenv";
import UserRoute from "./routes/UserRoute.js";
import ProductRoute from "./routes/ProductRoute.js";
import AuthRoute from "./routes/AuthRoute.js";
import SequelizeStore from "connect-session-sequelize";
import Db from "./config/Database.js";

dotenve.config();

const app = express();

const sessionStore = SequelizeStore(session.Store);

const store = new sessionStore({
    db: Db
})

// (async () => {
//     await Db.sync();
// })();

// session
app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: true,
        store: store,
        cookie: {
            secure: "auto",
        },
    })
);

// middleware
app.use(
    cors({
        credentials: true,
        origin: ["http://localhost:3000", "http://localhost:5173"],
    })
);

app.use(express.json());
app.use(UserRoute);
app.use(ProductRoute);
app.use(AuthRoute);

// membuat tabel session di db
// store.sync();

app.listen(process.env.APP_PORT, () => {
    console.log("Server Running...");
});
