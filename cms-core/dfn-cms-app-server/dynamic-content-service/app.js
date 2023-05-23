const express = require('express');
const cors = require('cors');
const app = express();

/**
 * --------------- MIDDLEWARE -----------------------------------
 */
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
//Enable All CORS Requests
app.use(cors());

/**
 * ----------------- SERVER -------------------------------------
 */
const PORT = process.env.PORT || 4400;
app.listen(PORT, () => {
    console.log(`Server has started on http://localhost:${PORT}`);
});
