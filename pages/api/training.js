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
                
            const training = await db
                .collection("training")
                .insertOne( { user_id: user.id, date: req.body.date, type: req.body.type, time: req.body.time, duration: req.body.duration } )

            res.json(training)
        } catch (e) {
            console.error(e);
        }
    }
 }