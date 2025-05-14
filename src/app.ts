import express, { Request, Response, NextFunction } from "express";
import session from "express-session";
import path from "path";
import dotenv from "dotenv";
//import authRoutes from "./routes/authRoutes";
import homeRoutes from "./routes/homeRoutes";
import cookieParser from "cookie-parser";

dotenv.config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use(cookieParser());

const loggingMiddleware = (req: Request, res: Response, next: NextFunction): void => {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] ${req.method} ${req.url}`);
    next();
};

app.use(loggingMiddleware);

app.use(session({
    secret: process.env.SESSION_SECRET || 'your_session_secret',
    resave: false,
    saveUninitialized: false
}));

app.set("view engine", "ejs");
app.set("views", path.join(process.cwd(), "./src/views"));

app.use("/", homeRoutes);
//app.use("/home", homeRoutes);

app.get("/dashboard", (req, res) => {
    if (!req.session.user) return res.redirect("/login");
    res.render("dashboard", { user: req.session.user });
});

app.get("/", (req, res) => {
    res.redirect("/auth/login");
});

app.use((req, res) => {
    res.status(404).render("404");
});

const PORT = process.env.PORT || 7000;
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}/`);
});
