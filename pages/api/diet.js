export default async (req, res) => {
    if (req.method === 'POST') {
        try {
            const { MongoClient, ServerApiVersion } = require('mongodb')
            const uri = "mongodb+srv://ianfboldea:asdfjkl;11@hypertension-cluster.vkdattq.mongodb.net/?retryWrites=true&w=majority"
            const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 })
            const db = client.db("auth")

            const user = await db
                .collection("users")
                .findOne({name: req.body.name})
    
            console.log('user', user)
                
            const diet = await db
                .collection("diet")
                .insertOne( { user_id: user.id, date: req.body.date, cals: req.body.cals, quantity: req.body.quantity, foodName: req.body.foodName } )

            res.json(diet)
        } catch (e) {
            console.error(e);
        }
    }
 }