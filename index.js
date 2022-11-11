const express = require('express');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require('cors');
const jwt = require('jsonwebtoken');
require('dotenv').config()
const app = express();
const port = process.env.port || 5000;

// middleware
app.use(cors());
app.use(express.json())


// MongoDB

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.o5lz3b5.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


// function verifyJWT(req, res, next){
//     const authHeader = req.headers.authorization;
//     console.log(authHeader);

//     if(!authHeader){
//         return res.status(401).send({message: 'unauthorized access'});
//     }
//     const token = authHeader.split(' ')[1];
//     console.log(token)
//     // console.log(token, process.env.ACCESS_TOKEN_SECRET)
//     console.log(jwt.verify(token, process.env.ACCESS_TOKEN_SECRET))
//     jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, function(err, decoded){
//         console.log(err);
//         console.log(decoded);
        
//         if(err){
//             console.log('Error', 'From not verify')
//             return res.status(403).send({message: 'Forbidden access'});
//         }
//         req.decoded = decoded;  
//         next();
//     })
// }


// Run Function
async function run(){
    try{

        const serviceCollection = client.db('worldPhotography').collection('photography');
        const reviewCollection = client.db('worldPhotography').collection('review');

        // app.post('/jwt', (req, res) =>{
        //     const user = req.body;
        //     console.log(user)
        //     console.log(process.env.ACCESS_TOKEN_SECRET);
        //     const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h'})
        //     res.send({token})
        // }) 
        
        app.get('/homeServices', async (req, res) =>{
            const query = {};
            const cursor = serviceCollection.find(query).limit(3);
            const result = await cursor.toArray();
            res.send(result);
        })

        

        app.post('/addService', async (req,res) =>{
            const service = req.body;
            const result = await serviceCollection.insertOne(service);
            res.send(result);
        })

        app.get('/services', async (req, res) =>{
            const query = {};
            const cursor = serviceCollection.find(query);
            const result = await cursor.toArray();
            res.send(result);
        })

        // app.get('/myReviews', verifyJWT, async (req, res) => {
        //     const decoded = req.decoded;
            
        //     if(decoded.email !== req.query.email){
        //         res.status(403).send({message: 'unauthorized access'})
        //     }
        //     console.log(req.query.email);
        //     console.log(decoded)
        //     let query = {};
        //     if (req.query.email) {
        //         query = {
        //             email: req.query.email
        //         }
        //     }
        //     console.log(query)
        //     const cursor = reviewCollection.find(query);
        //     const reviews = await cursor.toArray();
        //     // console.log(reviews);
        //     res.send(reviews);
            
        // });

            app.get('/myReviews', async (req, res) => {
            
            let query = {};
            if (req.query.email) {
                query = {
                    email: req.query.email
                }
            }
            console.log(query)
            const cursor = reviewCollection.find(query);
            const reviews = await cursor.toArray();
            console.log(reviews);
            res.send(reviews);
            
        });

        app.post('/addReview', async(req,res)=>{
            const review = req.body;
            const result = await reviewCollection.insertOne(review);
            res.send(result);
        })

        app.get('/review/:id', async(req, res)=>{
            const id = req.params.id;
            const query = {serviceId : id};
            const cursor = reviewCollection.find(query).sort({date: -1});
            const result = await cursor.toArray();
            res.send(result);
        })

        app.get('/review/edit/:id', async(req, res)=>{
            const id = req.params.id;
            const query = {_id : ObjectId(id)};
            const cursor = reviewCollection.find(query);
            const result = await cursor.toArray();
            res.send(result);
        })

        // http://localhost:5000/review/edit/${params.id}

        app.delete('/myReviews/:id', async (req, res) => {
            const id = req.params.id;
            console.log(id)
            const query = { _id: ObjectId(id) };
            const result = await reviewCollection.deleteOne(query);
            res.send(result);
        })

        app.get('/services/:id', async (req, res)=>{
            const id = req.params.id;
            // console.log(id);
            const query = { _id : ObjectId(id)};
            const cursor = serviceCollection.find(query);
            const result = await cursor.toArray();
            res.send(result);
        })
    }
    finally{

    }
}

run().catch(error => console.error(error))


// Testing Rout 
app.get('/', (req, res) => {
    res.send('Welcome to World Photography');
})

// Server Running
app.listen(port, ()=>{
    console.log(`The port is listening on prot ${port}`)
})