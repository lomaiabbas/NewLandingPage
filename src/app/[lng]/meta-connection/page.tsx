import { ChannelsList } from './_components/list'

export default async function MetaConnection({ params: { lng } }: any) {
  return <ChannelsList lng={lng} />
}
