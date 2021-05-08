import path from 'path';
import dotenv from 'dotenv';
import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import cors from 'cors';
import postRoutes from './routes/posts.js';
const __dirname = path.resolve();

dotenv.config();
const app = express();

app.use(bodyParser.json({ limit: '30mb', extended: true }))
app.use(bodyParser.urlencoded({ limit: '30mb', extended: true }))
app.use(cors());

app.use('/posts', postRoutes);
if(process.env.NODE_ENV === "production"){
  app.use(express.static(path.join(__dirname, '/client/build')));

  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client', 'build', 'index.html'));
  })
}
else{
  app.get("/", (req, res) => {
    res.json({ message: "API running..." });
  });
}
const CONNECTION_URL = process.env.MONGO_URI;
const PORT = process.env.PORT|| 5000;

mongoose.connect(CONNECTION_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => app.listen(PORT, () => console.log(`Server Running on Port: http://localhost:${PORT}`)))
  .catch((error) => console.log(`${error} did not connect`));

mongoose.set('useFindAndModify', false);