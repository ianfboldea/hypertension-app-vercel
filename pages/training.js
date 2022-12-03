
import LoginButton from '../components/LoginButton'
import Nav from '../components/Nav'
import { SessionProvider } from "next-auth/react"
import { useSession, signIn, signOut } from "next-auth/react"
import { getSession } from 'next-auth/react'

export default function Training({ training }) {
  const { data: session } = useSession()
  const handleClick = async (e) => {
    e.preventDefault()
    const trainingType = document.getElementById('training-type').value
    const trainingDate = document.getElementById('training-date').value
    const trainingTime = document.getElementById('training-time').value
    const trainingDuration = document.getElementById('training-duration').value
    fetch(
      `/api/training`,
      {
        body: JSON.stringify({date: trainingDate, type: trainingType, time: trainingTime, duration: trainingDuration, name: session.user.name}),
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'POST'
      }

    ).then((res) => res.json())
    .then((data) => {
      console.log(data)
      window.location.reload()
    })
  }
  return (
    <div class="py-16 bg-white center flex flex-col items-center">  
    <h2 class="text-2xl text-gray-900 font-bold md:text-4xl py-5">Excercise Log</h2>
    <div class="flex justify-center">
      <ul class="bg-white rounded-lg border border-gray-200 w-128 text-gray-900">
        {training.map((train) => (
          <li key={train._id} class="px-6 py-2 border-b border-gray-200 w-full">{train.date} | {train.type} workout at {train.time} for {train.duration} minutes</li>
        ))}
      </ul>
    </div>
    <form class="w-full max-w-xl mt-6 flex flex-row gap-3">
      <div class="inline-block relative w-36">
        <label>Workout</label>
        <select id="training-type" class="block appearance-none w-full bg-white hover:border-gray-500 px-4 py-2 rounded shadow leading-tight focus:outline-none focus:shadow-outline" required>
          <option>Running</option>
          <option>Weight Training</option>
          <option>Swimming</option>
        </select>
      </div>
      <div class="flex flex-col">
        <label for="trip-start">Date of Training</label>
        <input type="date" id="training-date" name="trip-start" class="px-4 py-2 rounded shadow leading-tight w-32" required></input>
      </div>
      <div class="flex flex-col">
        <label for="training">Time</label>
        <input type="time" id="training-time" name="training" min="09:00" max="18:00" class="px-4 py-2 rounded shadow leading-tight w-24" required></input>
      </div>
      <div class="flex flex-col">
        <label for="duration">Duration</label>
        <input type="number" id="training-duration" name="duration" min="09:00" max="18:00" class="px-4 py-2 rounded shadow leading-tight w-24" defaultValue="60" required></input>
      </div>
      <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="button" onClick={e => handleClick(e)}>
        Submit
      </button>
    </form>
    </div>
  )
}

export async function getServerSideProps(ctx) {
  try {
    const { MongoClient, ServerApiVersion } = require('mongodb')
    const uri = "mongodb+srv://ianfboldea:asdfjkl;11@hypertension-cluster.vkdattq.mongodb.net/?retryWrites=true&w=majority"
    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 })
    const db = client.db("auth")

    const session = await getSession(ctx)

    const user = await db.collection("users").findOne({ name: session.user.name })
 
    const training = await db
        .collection("training")
        .find({ user_id: user.id })
        .sort({ date: -1, time: 1 })
        .limit(10)
        .toArray();

    return {
      props: { training: JSON.parse(JSON.stringify(training)) },
    };
  } catch (e) {
      console.error(e);
  }
}
