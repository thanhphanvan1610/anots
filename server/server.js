import express from 'express';
import 'dotenv/config';
import cors from 'cors';
import {isHttpError} from 'http-errors'
import connect from './database/connect.js';
import authRoutes from './routes/auth.routes.js';
import userRoutes from './routes/users.routes.js';


const app = express();
const PORT = process.env.PORT;

app.use(cors());
app.use(express.json());
//middlewares Authentication
app.use('/v1/auth',authRoutes);

app.use('/v1/users', userRoutes)

// middlewares catch error

app.use((error, req, res, next) => {
    let errorMessage = 'Something went wrong!';
    let statusCode = 500;
  
    if (isHttpError(error)) {
      const httpError = error;
      statusCode = httpError.status;
      errorMessage = httpError.message;
    }
  
    res.status(statusCode).json({status: 'error', message: errorMessage, code: statusCode });
});

app.listen(PORT, async() => {
    await connect();
    console.log(`Server running on port ${PORT}`);
})