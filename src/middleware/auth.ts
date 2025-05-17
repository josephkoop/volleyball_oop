import { Request, Response, NextFunction } from "express";

// Middleware to check if user is logged in
export function isAuthenticated(req: Request, res: Response, next: NextFunction) {
    if (req.session.user) {
        return next();
    }
    res.redirect("/login?error=" + encodeURIComponent("Please log in to continue."));
}

// Middleware to check if user is not logged in
export function isNotAuthenticated(req: Request, res: Response, next: NextFunction) {
    if (!req.session.user) {
        return next();
    }
    res.redirect("/login?error=" + encodeURIComponent("Already logged in."));
}

// Middleware to check if user is admin
export function isAdmin(req: Request, res: Response, next: NextFunction) {
    if (req.session.user && (req.session.user.role === "admin")) {
        return next();
    }
    res.redirect("/login");
}
