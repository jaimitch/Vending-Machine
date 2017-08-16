
const router = require('express').Router();
const items = require('../models/items');
const machine = require('../models/machine');
const moment = require('moment');

// console.log(machine);
// console.log(items);

router.get('/', function(request, response){
    return response.json({home: 'home'});
});


// A customer should be able to get a list of the current items, their costs, and quantities of those items
router.get('/api/customer/items', function(request, response){
    return response.json(items);
});


// A customer should be able to buy an item using money
router.post('/api/customer/items/:itemId/purchases', function(request, response){

    // get item id
    let itemId = +request.params.itemId;
    // use id to find specific item customer purchase
    let item = items.find( e => e.id === itemId );
    let money = request.body.money;
    let date =  moment().format("MMM DD, YYYY h:mm a");

    console.log()
    // check to see if money given is greater or equal to item cost
    if (money >= item.cost) {

        // check to see if the item is in stock
        if (item.quantity > 0) {
            machine.total += item.cost;
            machine.purchases.push(item, date);
            
            money = money -  item.cost;
          

            console.log(machine.purchases);
            return response.json({ status: "success", change:money})
        } else {
            return response.json({ status: "failure", message: "sorry this item is out of stock", change:money})
        }
    } else {
        return response.json({ status: "failure", message: "you do not have enough money", change:money});
    }
    
});



//  get a list of all purchases with their item and date/time
router.get('/api/vendor/purchases', function(request, response){
    return response.json({machine: machine.purchases });
});


// GET /api/vendor/money - get a total amount of money accepted by the machine
router.get('/api/vendor/money', function(request, response){
    return response.json({ machine: machine.totalMoneyHeld });
});


// POST /api/vendor/items - add a new item not previously existing in the machine
router.post('/api/vendor/items', function(request, response){
    let itemId = items.length + 1;

    const description = request.body.description;
    const cost = request.body.cost;
    const quantity = request.body.quantity;
    const brand = request.body.brand;

    items.push({id: itemId, description: description, cost: cost, quantity: quantity, brand: brand });
    
    
    
    return response.json({ item: items[items.length - 1]})

  
    // {"description":"sugar donuts", "cost": 30, "quantity": 77, "brand": "Snack Company"}
});


// PUT /api/vendor/items/:itemId - update item quantity, description, and cost
router.post('/api/vendor/items/:itemId', function(request, response){
    let itemId = +request.params.itemId;
    // use id to find specific item customer purchase
    let item = items.find( e => e.id === itemId );

    console.log(item);

    item.description = request.body.description;
    item.cost = request.body.cost;
    item.quantity = request.body.quantity;
    item.brand = request.body.brand;

    // items.push({"id": itemId, "description": request.body.description, "cost": request.body.cost, "quantity": request.body.quantity, "brand": request.body.brand });

    // remove item out of array

    // remove item out of array
    items.slice(itemId + 1, 1);
    items.splice(itemId - 1, item);
    
    return response.json({item: item});

})

module.exports = router;