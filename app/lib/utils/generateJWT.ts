import jwt from "jsonwebtoken";

export const generateToken = (userId: string) => {
    console.log("userId", userId);

    const token = jwt.sign({ userId }, process.env.JWT_SECRET as string, {
        expiresIn: "7d",
    });

    return token;
};

export const setTokenCookie = (token: string, response: Response) => {
    const cookieOptions = [
        `jwt=${token}`,
        "Max-Age=1209600", // 15 days in seconds
        "HttpOnly",
        "Path=/",
        "SameSite=Strict",
        process.env.NODE_ENV === "production" ? "Secure" : "",
    ];

    response.headers.append("Set-Cookie", cookieOptions.filter(Boolean).join("; "));
};

export default generateToken;
