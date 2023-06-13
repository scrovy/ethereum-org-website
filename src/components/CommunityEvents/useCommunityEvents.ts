// Libraries
import React, { useEffect, useState } from "react"

// Constants
import { GATSBY_FUNCTIONS_PATH } from "../../constants"

// Utils
import { getData } from "../../utils/cache"

// Interface
interface Event {
  date: string
  title: string
  calendarLink: string
  pastEventLink: string | undefined
}

interface State {
  pastEventData: Array<Event>
  upcomingEventData: Array<Event>
  loading: boolean
  hasError: boolean
}

export const useCommunityEvents = () => {
  const [state, setState] = useState<State>({
    pastEventData: [],
    upcomingEventData: [],
    loading: true,
    hasError: false,
  })

  useEffect(() => {
    try {
      const fetchCalendarData = async () => {
        const events = await getData(`${GATSBY_FUNCTIONS_PATH}/calendarEvents`)
        const pastEventData = events.pastEvents.map((event) => {
          return {
            date: event.start.dateTime,
            title: event.summary,
            calendarLink: event.htmlLink,
            pastEventLink: event.location,
          }
        })
        const upcomingEventData = events.futureEvents.map((event) => {
          return {
            date: event.start.dateTime,
            title: event.summary,
            calendarLink: event.htmlLink,
            pastEventLink: event.location,
          }
        })
        setState({
          ...state,
          pastEventData,
          upcomingEventData,
          loading: false,
          hasError: false,
        })
      }
      fetchCalendarData()
    } catch {
      setState({ ...state, loading: false, hasError: true })
    }
  }, [])

  return state
}