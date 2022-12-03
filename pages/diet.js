
import LoginButton from '../components/LoginButton'
import Nav from '../components/Nav'
import { SessionProvider } from "next-auth/react"
import { useEffect, useState } from 'react'
import { getSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { useSession } from 'next-auth/react'

export default function Diet({ diet }) {
  const { data: session } = useSession()
  useEffect(() => {
    document.getElementById('training-date').value = (new URLSearchParams(window.location.search)).get('date')
  })
  const handleClick = async (e) => {
    e.preventDefault()
    const foodName = document.getElementById('food-name').value
    const date = (new URLSearchParams(window.location.search)).get('date')
    const quantity = parseInt(document.getElementById('food-quantity').value)
    const cals = parseInt(document.getElementById('cals-per-item').value) * quantity
    const category = document.getElementById('meal-type').value
    fetch(
      `/api/diet`,
      {
        body: JSON.stringify({date: date, foodName: foodName, name: session.user.name, quantity: quantity, cals: cals, category: category}),
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
      <div class="flex flex-col justify-center mt-3 w-full max-w-xl">
      <h4 class="text-gray-900 font-bold md:text-4xl py-2">Breakfast</h4>
        <ul class="bg-white rounded-lg border border-gray-200 w-full text-gray-900">
          {diet.map((item) => (
            item.category == 'Breakfast' && <li key={item._id} class="px-6 py-2 border-b border-gray-200 w-full"><strong>{item.cals} cals:</strong> {item.quantity} {item.foodName}</li>
          ))}
        </ul>
      </div>
      <div class="flex flex-col justify-center mt-3 w-full max-w-xl">
        <h4 class="text-gray-900 font-bold md:text-4xl py-2">Lunch</h4>
        <ul class="bg-white rounded-lg border border-gray-200 w-full text-gray-900">
          {diet.map((item) => (
            item.category == 'Lunch' && <li key={item._id} class="px-6 py-2 border-b border-gray-200 w-full"><strong>{item.cals} cals:</strong> {item.quantity} {item.foodName}</li>
          ))}
        </ul>
      </div>
      <div class="flex flex-col justify-center mt-3 w-full max-w-xl">
        <h4 class="text-gray-900 font-bold md:text-4xl py-2">Dinner</h4>
        <ul class="bg-white rounded-lg border border-gray-200 w-full text-gray-900">
          {diet.map((item) => (
            item.category == 'Dinner' && <li key={item._id} class="px-6 py-2 border-b border-gray-200 w-full"><strong>{item.cals} cals:</strong> {item.quantity} {item.foodName}</li>
          ))}
        </ul>
      </div>
      <div class="flex flex-col justify-center mt-2 w-full max-w-xl">
        <h4 class="text-gray-900 font-bold md:text-4xl py-2">Total</h4>
        <ul class="bg-white rounded-lg border border-gray-200 w-full text-gray-900">
          <li class="px-6 py-2 border-b border-gray-200 w-full"><strong>{diet.reduce((accumulator, foodEntry) => { return accumulator + foodEntry.cals; }, 0)} total calories</strong></li>
        </ul>
      </div>
      <form class="w-full max-w-xl mt-6 flex flex-row gap-3">
        <div class="flex flex-col">
          <label>Food Name</label>
          <input id="food-name" class="block appearance-none w-full bg-white hover:border-gray-500 px-2 py-3 rounded shadow leading-tight focus:outline-none focus:shadow-outline w-32" placeholder="Steak" required></input>
        </div>
        <div class="flex flex-col">
          <label>Quantity</label>
          <input type="number" id="food-quantity" defaultValue="1" class="px-2 py-3 rounded shadow leading-tight w-16" required></input>
        </div>
        <div class="flex flex-col">
          <label>Cals per Item</label>
          <input type="number" id="cals-per-item" name="cals" defaultValue="100" class="px-2 py-3 rounded shadow leading-tight w-24" required></input>
        </div>
        <div class="inline-block relative w-36">
          <label>Meal</label>
          <select id="meal-type" class="block appearance-none w-full bg-white hover:border-gray-500 px-4 py-3 rounded shadow leading-tight focus:outline-none focus:shadow-outline" required>
            <option>Breakfast</option>
            <option>Lunch</option>
            <option>Dinner</option>
          </select>
        </div>
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

