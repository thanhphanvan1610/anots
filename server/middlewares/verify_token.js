import jwt from 'jsonwebtoken';
import 'dotenv/config'

const verifyAccessToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if(!authHeader){
        return res.status(401).json({
            status: 'failed',
            message: 'Authentication failed: No token provided',
            code: 401
        });
    }
    const token = authHeader.split(' ')[1];
    jwt.verify(token, process.env.SECRET_ACCESS, (err, decoded) => {
        if(err){
            return res.status(403).json({
                status: 'failed',
                message: 'Failed to authenticate token',
                code: 403
            });
        }
        req.user = decoded;
        next();
    })
}

const checkAdmin = (req, res, next) => {
    verifyAccessToken(req, res, () => {
        if(req.user && req.user.role === 'admin'){
            next();
        }else{
            return res.status(403).json({
                status: 'failed',
                message: 'Insufficient permissions',
                code: 403
            });
        }
    })
}

export { verifyAccessToken, checkAdmin };
