
import { LoaderPinwheel } from 'lucide-react'
const Loader = () => {
  return (
    <div className="z-50 flex min-h-[calc(100vh_-_80px)] w-full items-center justify-center gap-2">
      <LoaderPinwheel width={34} height={34} className="animate-spin text-primary" />
      <p className='pt-2 text-lg font-semibold'>Please wait...</p>
    </div>
  )
}

export default Loader
