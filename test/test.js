const request = require("supertest");
const assert = require('assert');
const expect = require('chai').expect;
const chaiHttp = require('chai-http');
const application = require("../app");

// models 
const items = require('../models/items');
const machine = require('../models/machine');



describe('Customer', function () {

    // customer should be able to get a list of the current items, their costs, and quantities of those items
    it('customer should be able to get a list of the current items, their costs, and quantities of those items', function (done) {
        request(application)
            .get('/api/customer/items')
            .expect("Content-Type", "application/json; charset=utf-8")
            .expect(200)
            .expect(function (response) {
                assert.deepEqual(response.body, items);
            }).end(done);
    });



    // A customer should be able to buy an item using money
    it('A customer should be able to buy an item using money', function (done) {
        request(application)
            .post('/api/customer/items/1/purchases')
            .send({ money: 65 })
            .expect("Content-Type", "application/json; charset=utf-8")
            .expect(function (response) {

                let money = 65;

                assert.deepEqual(response.body, { status: "success", change: money });
            }).end(done)
    });



    //   get a list of all purchases with their item and date/time
    it('get a list of all purchases with their item and date/time', function (done) {
        request(application)
            .get('/api/vendor/purchases')
            .expect("Content-Type", "application/json; charset=utf-8")
            .expect(200)
            .expect(function (response) {
                assert.deepEqual(response.body, { machine: machine.purchases });
            }).end(done)
    });




    // GET /api/vendor/money - get a total amount of money accepted by the machine
    it('get a total amount of money accepted by the machine', function (done) {
        request(application)
            .get('/api/vendor/money')
            .expect("Content-Type", "application/json; charset=utf-8")
            .expect(200)
            .expect(function (response) {
                assert.deepEqual(response.body, { machine: machine.totalMoneyHeld });
            }).end(done)
    });




    // POST /api/vendor/items - add a new item not previously existing in the machine
    it('add a new item not previously existing in the machine', function (done) {

        request(application)
            .post('/api/vendor/items')
            .send({
                "id": 6,
                "description": "snickers",
                "cost": 89,
                "quantity": 40,
                "brand": "Snack Company"
            })
            .expect("Content-Type", "application/json; charset=utf-8")
            .expect(200)
            .expect(function (response) {
                var item = {
                    "id": 6,
                    "description": "snickers",
                    "cost": 89,
                    "quantity": 40,
                    "brand": "Snack Company"
                }

                assert.deepEqual(response.body.item, item);
            }).end(done)
    });


    // PUT /api/vendor/items/:itemId - update item quantity, description, and cost
    it('update item quantity, description, and cost', function (done) {
        request(application)
            .post('/api/vendor/items/1')
            .send({
                "id": 1,
                "description": "starburst",
                "cost": 89,
                "quantity": 20,
                "brand": "Snack Company"
            })
            .expect("Content-Type", "application/json; charset=utf-8")
            .expect(200)
            .expect(function (response) {
                var item = {
                    "id": 1,
                    "description": "starburst",
                    "cost": 89,
                    "quantity": 20,
                    "brand": "Snack Company"
                } 
                assert.deepEqual(response.body.item, item);
            }).end(done)
    });

});