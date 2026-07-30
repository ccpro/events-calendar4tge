import EventRegistrationForm from '@/components/registration/EventRegistrationForm'

type EventRegistrationPageProps = {
    params: Promise<{ eventId: string; playerId: string }>
}

const EventRegistrationPage = async ({ params }: EventRegistrationPageProps) => {
    const { eventId, playerId } = await params

    return <EventRegistrationForm eventId={eventId} playerId={playerId} />
}

export default EventRegistrationPage
