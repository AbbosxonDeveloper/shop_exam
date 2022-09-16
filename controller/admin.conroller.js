import sha256 from "sha256";
import { AuthorizationError } from "../utils/errors.js";
import jwt from "../utils/jwt.js";
import { read, write } from "../utils/model.js";

const LOGIN = (req, res, next) => {
    try {
        let { username, password } = req.body
        let admin = read('admin')

        let user = admin.find(user => user.username == username && user.password == sha256(password))
        let agent = req.headers["user-agent"];
        let ip = req.ip;

        if (!user) {
            return next(new AuthorizationError(401, "wrong username or password"))
        }

        return res.status(200).json({
            status: 200,
            message: "ok",
            data: user,
            token: jwt.sign({ userId: user.userId, agent: agent, ip: ip }),
        });
    } catch (error) {

    }
}

export default { LOGIN }