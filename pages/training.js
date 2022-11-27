
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
    fetch(
      `/api/training`,
      {
        body: JSON.stringify({date: trainingDate, type: trainingType, time: trainingTime, name: session.user.name}),
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
    <h2 class="text-2xl text-gray-900 font-bold md:text-4xl py-5">Training Log</h2>
    <div class="flex justify-center">
      <ul class="bg-white rounded-lg border border-gray-200 w-128 text-gray-900">
        {training.map((train) => (
          <li class="px-6 py-2 border-b border-gray-200 w-full">{train.type} workout at {train.time} on {train.date}</li>
        ))}
      </ul>
    </div>
    <form class="w-full max-w-xl mt-6 flex flex-row gap-3">
      <div class="inline-block relative w-36">
      <select id="training-type" class="block appearance-none w-full bg-white hover:border-gray-500 px-4 py-3 rounded shadow leading-tight focus:outline-none focus:shadow-outline" required>
        <option>Running</option>
        <option>Weight Training</option>
        <option>Swimming</option>
      </select>
      <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
        <svg class="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
      </div>
      </div>
      <input type="date" id="training-date" name="trip-start" class="px-4 py-2 rounded shadow leading-tight" required></input>
      <input type="time" id="training-time" name="training" min="09:00" max="18:00" class="px-4 py-2 rounded shadow leading-tight" required></input>
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
