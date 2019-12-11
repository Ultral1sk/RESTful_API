const express = require('express');
const router  = express.Router();
const mongoose = require('mongoose');

const Product = require('../models/product');

router.get('/', ( req, res, next) => {
    Product.find()
    .exec()
      .then( docs => {
          console.log(docs);
        //   if (docs.length >= 0) {     // this is giving us information when we dont have any entries inside our response
              res.status(200).json(docs);  // in case we want to fetch data but we dont have any
              
        //   } else {
        //       res.status(404).json({
        //           message : 'No entries found'
        //       });
        //   }
      })
        .catch(err => {
            res.status(500).json({
                error : err
            });
        });
});

router.post('/', ( req, res, next) => {
    //  creating/constructing the object with unique ID and what kind of data should receive , name, price
    const product = new Product({
        _id    : new mongoose.Types.ObjectId(),  //creating unique id
        name  : req.body.name,
        price : req.body.price
    });
    product.save().then( result => {
        console.log(result);
    })
    .catch(err => console.log(err));
    
    res.status(201).json({
        message : 'Handling POST request to /products',
        createdProduct : product                        //  if the status is 201 show me the object stored in to producct variable
    });
});

router.get('/:productId', ( req, res, next) => {
    const id = req.params.productId;
    Product.findById(id)
    .exec()
      .then( doc => {
          console.log("From database", doc);
          if( doc ) {
              res.status(200).json(doc);

          } else {
             res.status(404).json({ message : 'No valid entry found for provided ID'});
          }
      })
        .catch(err => {
            console.log(err);
            res.status(500).json({error: err});
        
        });
});

// updating the data into the database
router.patch('/:productId', ( req, res, next) => {

    const id = req.params.productId;
    const updateOps = {};
    for ( const ops of req.body ) {
        updateOps[ops.propName] = ops.value  // this will give us an object like the comented one
    }
    // the second argument describes how we want to update it special property $set and pass another obj
      Product.update({_id : id}, {$set : updateOps/* { name: req.body.newName, price : req.body.newPrice } */})
        .exec()
          .then( result => {
              console.log(result)
                res.status(200).json(result);
              
          })
            .catch(err => {
                res.status(500).json({
                    error : err
                })
          })
});

router.delete('/:productId', ( req, res, next) => {
    const id = req.params.productId;
    Product.remove({_id : id}) // remove any object that is going to receive the productId comming from the /:productId route
      .exec()
        .then( result => {                   // when we delte the data we dont get an empty array we get NULL
            res.status(200).json(result);   // it is important for our GET ROUTE above
        })
          .catch( err => {
              res.status(500).json({
                  error : err
              });
          });
});

module.exports = router