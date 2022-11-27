
import LoginButton from '../components/LoginButton'
import Nav from '../components/Nav'
import { SessionProvider } from "next-auth/react"
import { useEffect, useState } from 'react'
import { getSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { useSession } from 'next-auth/react'

export default function Diet({ diet }) {
  const { data: session } = useSession()
  const handleClick = async (e) => {
    e.preventDefault()
    const foodName = document.getElementById('food-name').value
    const date = document.getElementById('training-date').value
    const quantity = parseInt(document.getElementById('food-quantity').value)
    const cals = parseInt(document.getElementById('cals-per-item').value) * quantity
    fetch(
      `/api/diet`,
      {
        body: JSON.stringify({date: date, foodName: foodName, name: session.user.name, quantity: quantity, cals: cals}),
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
  const router = useRouter()
  const { query } = router
  const handleOnChange = e => {
    router.push(window.location.href.split('?')[0] + '?date=' + document.getElementById('training-date').value, undefined, {shallow: false})
  }
  return (
    <div class="py-16 bg-white center flex flex-col items-center">  
      <h2 class="text-2xl text-gray-900 font-bold md:text-4xl py-5">Daily Nutrition</h2>
      <form class="w-full max-w-xl mt-6 flex flex-col gap-3">
        <input type="date" id="training-date" name="trip-start" class="px-4 py-2 rounded shadow leading-tight" defaultValue={query.date} onChange={e => handleOnChange(e)}></input>
      </form>
      <div class="flex justify-center mt-3 w-full max-w-xl">
        <ul class="bg-white rounded-lg border border-gray-200 w-full text-gray-900">
          {diet.map((item) => (
            <li class="px-6 py-2 border-b border-gray-200 w-full"><strong>{item.cals} cals:</strong> {item.quantity} {item.foodName}</li>
          ))}
        </ul>
      </div>
      <div class="flex justify-center mt-2 w-full max-w-xl">
        <ul class="bg-white rounded-lg border border-gray-200 w-full text-gray-900">
          <li class="px-6 py-2 border-b border-gray-200 w-full"><strong>{diet.reduce((accumulator, foodEntry) => { return accumulator + foodEntry.cals; }, 0)} total calories</strong></li>
        </ul>
      </div>
      <form class="w-full max-w-xl mt-6 flex flex-row gap-3">
        <input id="food-name" class="block appearance-none w-full bg-white hover:border-gray-500 px-2 py-3 rounded shadow leading-tight focus:outline-none focus:shadow-outline" placeholder="Food name" required></input>
        <input type="number" id="food-quantity" defaultValue="1" class="px-2 py-2 rounded shadow leading-tight w-16" required></input>
        <input type="number" id="cals-per-item" name="cals" defaultValue="100" class="px-2 py-2 rounded shadow leading-tight w-16" required></input>
        <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-2 rounded focus:outline-none focus:shadow-outline" type="button" onClick={e => handleClick(e)}>
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
 
    const diet = await db
      .collection("diet")
      .find({ user_id: user.id, date: ctx.query.date })
      .sort({ date: 1 })
      .limit(10)
      .toArray();

    return {
      props: { diet: JSON.parse(JSON.stringify(diet)) },
    }
  } catch (e) {
      console.error(e);
  }
}

