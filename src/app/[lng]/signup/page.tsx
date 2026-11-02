import SignupPage from './_components/signup-page'

export default function Signup({ params: { lng } }: { params: { lng: string } }) {
  return <SignupPage lng={lng} />
}
