
import LoginButton from '../components/LoginButton'
import Nav from '../components/Nav'
import { SessionProvider } from "next-auth/react"
import App from './_app'
import Script from 'next/script'
import { useSession, signIn, signOut } from "next-auth/react"
import { useState, setState } from "react"
import { getSession } from 'next-auth/react'

export default function Appointments({ appointments }) {
  const { data: session } = useSession()
  const handleClick = async (e) => {
    e.preventDefault()
    const visitType = document.getElementById('visit-type').value
    const appointmentDate = document.getElementById('appointment-date').value
    console.log(appointmentDate)
    fetch(
      `/api/appointments`,
      {
        body: JSON.stringify({date: appointmentDate, visit: visitType, name: session.user.name}),
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
    <>
    <div class="py-16 bg-white">  
      <div class="container m-auto px-6 text-gray-600 md:px-12 xl:px-6">
          <div class="space-y-6 md:space-y-0 md:flex md:gap-6 lg:items-center lg:gap-12">
            <div class="md:5/12 lg:w-5/12">
              <img src="appointments.avif" alt="image" loading="lazy" width="" height="" class="rounded"></img>
            </div>
            <div class="md:7/12 lg:w-6/12">
              <h2 class="text-2xl text-gray-900 font-bold md:text-4xl">Upcoming Appointments</h2>
              <ul class="ml-4 list-disc mt-2">
              {appointments.map((appointment) => (
                new Date(appointment.date) > Date.now() && <li><strong>{appointment.visit}: </strong>{appointment.date}</li>
              ))}
              </ul>
            </div>
          </div>
      </div>
    </div>
    <div class="py-24 bg-blue-50">  
      <div class="container m-auto px-6 text-gray-600 md:px-12 xl:px-6">
          <div class="space-y-6 md:space-y-0 md:flex md:gap-6 lg:items-center lg:gap-12">
            <div class="w-full">
              <h2 class="text-2xl text-gray-900 font-bold md:text-4xl">Let's schedule a new appointment!</h2>
              <form class="w-full max-w-lg mt-6 flex flex-row gap-3">
                <input type="date" id="appointment-date" name="trip-start" class="px-4 py-2 rounded shadow leading-tight"></input>
                <div class="inline-block relative w-64">
                  <select id="visit-type" class="block appearance-none w-full bg-white hover:border-gray-500 px-4 py-3 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline">
                    <option>Regular Checkup</option>
                    <option>Emergency Visit</option>
                  </select>
                  <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                    <svg class="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                  </div>
                </div>
                <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="button" onClick={e => handleClick(e)}>
                  Submit
                </button>
              </form>
          </div>
        </div>
      </div>
    </div>
    </>
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
 
    const appointments = await db
        .collection("appointments")
        .find({ user_id: user.id })
        .sort({ date: 1 })
        .limit(10)
        .toArray();

    return {
      props: { appointments: JSON.parse(JSON.stringify(appointments)) },
    };
  } catch (e) {
      console.error(e);
  }
}
