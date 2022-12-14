import Link from "next/link"
import { useSession } from "next-auth/react"
import { useState, setState } from "react"

export default function NotificationCard({ appointments, name }) {
  const handleClick = async (e) => {
    e.preventDefault()
    document.getElementById('notification-card').style.display = 'None'
  }
  let days_until_appointment = null
    if (appointments.length > 0) {
      const sorted_arr = appointments.sort((a, b) => new Date(a.date) - new Date(b.date))
      let upcoming_appointment = null
      for (const item of sorted_arr) {
        if (new Date(item.date) >= Date.now()) {
          upcoming_appointment = item
          break
        }
      }
      if (upcoming_appointment) {
        const oneDay = 24 * 60 * 60 * 1000
        const firstDate = new Date(upcoming_appointment.date.split("-")[1] + '-' + upcoming_appointment.date.split("-")[2] + '-' + upcoming_appointment.date.split("-")[0])
        const secondDate = new Date()
        secondDate.setHours(0, 0, 0, 0)
        days_until_appointment = Math.ceil(Math.abs((firstDate - secondDate) / oneDay))
      }
      console.log(days_until_appointment)
    }
    
    return (
      <>
        {days_until_appointment &&
        <div class="notification-card-container" id="notification-card">
            <span onClick={e => handleClick(e)}>&times;</span>
            <h1>Hey, {name}!</h1>
            <p>Just wanted to let you know you&apos;ve got an appointment coming up in {days_until_appointment} days!</p>
        </div>}
      </>
    )
  }