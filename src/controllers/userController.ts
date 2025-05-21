// controllers/userController.ts
import { Request, Response } from "express";
import { UserClass } from "../models/UserClass";

export const getLogin = (req: Request, res: Response) => {
    const { error = '' } = req.query;
    const successMessage = req.session.successMessage || '';
    req.session.successMessage = null;
    res.render("login", { error, successMessage });
};

export const postLogin = async (req: Request, res: Response) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.redirect("/login?error=" + encodeURIComponent("All fields are required."));
    }

    try {
        const user = await UserClass.findByUsername(username);
        if (!user || !(await user.comparePassword(password))) {
            return res.redirect("/login?error=" + encodeURIComponent("Invalid credentials."));
        }

        req.session.user = { username: user.username, role: user.role, id: Number(user.id) };
        req.session.successMessage = "You have logged in successfully!";
        res.redirect("/home");
    } catch (error) {
        console.error(error);
        res.redirect("/login?error=" + encodeURIComponent("Login error."));
    }
};

export const getSignup = (req: Request, res: Response) => {
    const { error = '' } = req.query;
    res.render("signup", { error });
};

export const postSignup = async (req: Request, res: Response) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.redirect("/signup?error=" + encodeURIComponent("All fields are required."));
    }

    try {
        await UserClass.create(username, password);
        res.redirect("/login");
    } catch (error) {
        console.error(error);
        res.redirect("/signup?error=" + encodeURIComponent("User already exists or other error."));
    }
};

export const logout = (req: Request, res: Response) => {
    req.session.destroy(() => {
        res.redirect("/login");
    });
};

export const getUserManagement = async (req: Request, res: Response) => {
    try {
        const users = await UserClass.getAllExceptOverallAdmin();
        res.render("usermanagement", { users, error: req.query.error || null });
    } catch (error) {
        console.error(error);
        res.render("usermanagement", { error: "Error fetching users", users: [] });
    }
};

export const postAddAdmin = async (req: Request, res: Response) => {
    const { username, password } = req.body;

    try {
        const existingUser = await UserClass.findByUsername(username);
        if (existingUser) {
            res.status(500).json({ error: 'Username already exists' });
        }

        await UserClass.create(username, password, 'official');
        res.redirect("/users");
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to add official.' });
    }
};

export const postDeleteUser = async (req: Request, res: Response) => {
    const { id } = req.body;
    console.log("ID:", id);

    if(req.session.user){ 
        try {
            const currentUser = await UserClass.findByUsername(req.session.user.username);
            if (!currentUser?.canDeleteUsers()) {
                res.status(500).json({ error: 'You cannot delete users.' });
            }

            await UserClass.deleteById(Number(id));
            res.redirect("/users");
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Failed to delete user.' });
        }
    }else{
        res.status(500).json({ error: 'Failed to delete user.' });
    }
};
