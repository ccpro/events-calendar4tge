import PlayerRegistrationForm from '@/components/registration/PlayerRegistrationForm'

type PlayerRegistrationPageProps = {
    params: Promise<{ uuid: string }>
}

const PlayerRegistrationPage = async ({ params }: PlayerRegistrationPageProps) => {
    const { uuid } = await params
    return <PlayerRegistrationForm uuid={uuid} />
}

export default PlayerRegistrationPage
