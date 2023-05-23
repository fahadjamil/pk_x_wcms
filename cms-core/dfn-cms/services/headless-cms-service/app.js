// FIXME : Follow the npm module folder structure
const express = require('express');
const fileUpload = require('express-fileupload');
const cors = require('cors');
const app = express();
require('./config/config');

const websiteRoutes = require('./routes/website');
const pageRoutes = require('./routes/website/pages');
const pageDataRoutes = require('./routes/website/pageData');

/**
 * --------------- MIDDLEWARE -----------------------------------
 */
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(fileUpload());
//Enable All CORS Requests
app.use(cors());

/**
 * ---------------- ROUTES --------------------------------------
 */
app.use('/website', websiteRoutes);
app.use('/page', pageRoutes);
app.use('/page-data', pageDataRoutes);

/**
 * ----------------- SERVER -------------------------------------
 */
const PORT = process.env.PORT || 3200;
app.listen(PORT, () => { console.log(`Server has started on http://localhost:${PORT}`) });