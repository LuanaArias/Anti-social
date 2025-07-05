require('dotenv').config();
const conectarDB = require('./db/config/db.js')
const express = require('express');
const multer = require('multer');
const path = require('path');
const conectarRedis = require('./db/config/redis.js')
const app = express();
const PORT = process.env.PORT || 3001
const {userRoute, postRoute, imgRoute, commentRoute, tagRoute} = require('./routes')

const upload = multer({ dest: 'src/uploads/' });
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const swaggerDocument = YAML.load('src/docs/swagger.yaml');


app.use(express.json())
app.use('src/uploads/', express.static(path.join(__dirname, 'uploads')));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use("/user", userRoute);
app.use("/post", postRoute);
app.use("/image", imgRoute);
app.use("/comment", commentRoute);
app.use("/tag", tagRoute)

conectarDB()

app.listen(PORT, async () => {
    console.log(`La app arranco en el puerto ${PORT}.`);
    await conectarRedis.connect();
})



