import express from 'express';
import logger from "./logger.js";
import morgan from "morgan";
const app = express();
const port = 3000;

app.use(express.json());

const morganFormat = ":method :url :status :response-time ms";

app.use(
  morgan(morganFormat, {
    stream: {
      write: (message) => {
        const logObject = {
          method: message.split(" ")[0],
          url: message.split(" ")[1],
          status: message.split(" ")[2],
          responseTime: message.split(" ")[3],
        };
        logger.info(JSON.stringify(logObject));
      },
    },
  })
);
let cartData = [];
let nextId = 1;

//Add new item
app.post('/cart', (req, res) => {
    logger.info("A post request is made")
    const { name, price } = req.body;
    const newCart = { id: nextId++, name, price };
    cartData.push(newCart);
    res.status(201).send(newCart); 
});

// Get all items
app.get('/cart', (req, res) => {
    res.status(200).send(cartData); 
});

//  Get item by ID
app.get('/cart/:id', (req, res) => {
    const tea = cartData.find(t => t.id === parseInt(req.params.id));
    if (!tea) {
        return res.status(404).send('tea not found');
    }
    res.status(200).send(tea);
});

// Update item
app.put('/cart/:id', (req, res) => {
    const tea = cartData.find(t => t.id === parseInt(req.params.id));
    if (!tea) {
        return res.status(404).send('tea not found');
    }
    const { name, price } = req.body;
    tea.name = name;
    tea.price = price;

    res.status(200).send(tea);
});

// Delete item
app.delete('/cart/:id', (req, res) => {
    const index = cartData.findIndex(t => t.id === parseInt(req.params.id));
    if (index === -1) {
        return res.status(404).send('tea not found');
    }
    cartData.splice(index, 1);
    res.status(204).send(); 
});

// Start server
app.listen(port, () => {
    console.log(`server is listening at ${port}`);
});
