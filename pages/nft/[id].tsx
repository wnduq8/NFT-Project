import React, { useCallback } from 'react'
import { useAddress, useDisconnect, useMetamask } from '@thirdweb-dev/react'

type Props = {}

function NFTDetailPage(props: Props) {
  const connectWithMetamask = useMetamask()
  const address = useAddress()
  const disconnect = useDisconnect()

  const onClickAuth = useCallback(() => {
    if (address) {
      disconnect()
      return
    }
    connectWithMetamask()
  }, [address, connectWithMetamask, disconnect])

  console.log(address)

  return (
    <div className="flex h-screen flex-col lg:grid lg:grid-cols-10">
      <div className="bg-gradient-to-br from-cyan-800 to-rose-500  lg:col-span-4">
        <div className="flex flex-col items-center justify-center py-2 lg:min-h-screen">
          <div className="rounded-xl bg-gradient-to-br from-yellow-400 to-purple-600 p-2">
            <img
              src="https://links.papareact.com/8sg"
              alt="nft-img"
              className="w-44 rounded-xl object-cover lg:h-96 lg:w-72"
            />
          </div>
          <div className="space-y-2 p-5 text-center">
            <h1 className="text-4xl font-bold text-white">NFT name</h1>
            <h2 className="text-xl text-gray-300">NFT coments</h2>
          </div>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-12 lg:col-span-6">
        <header className="flex items-center justify-between">
          <h1 className="w-52 cursor-pointer text-xl font-extralight sm:w-80">
            The{' '}
            <span className="font-extrabold underline decoration-pink-600/50">
              NFT name
            </span>{' '}
            NFT Market Place
          </h1>
          <button
            onClick={onClickAuth}
            className="rounded-full bg-rose-400 px-4 py-2 text-xs font-bold text-white lg:px-5 lg:py-3 lg:text-base"
          >
            {address ? 'Sign Out' : 'Sign In'}
          </button>
        </header>
        <hr className="my-2 border" />
        {address && (
          <p>
            You're loggen in with Wallet {address.substring(0, 5)}...
            {address.substring(address.length - 5)}
          </p>
        )}
        <div className="mt-10 flex flex-1 flex-col items-center space-y-6 text-center lg:justify-center lg:space-y-0">
          <img
            src="https://links.papareact.com/bdy"
            alt="nft-img"
            className="w-80 object-cover pb-10 lg:h-40"
          />
          <h1 className="text-3xl font-bold lg:text-5xl lg:font-extrabold">
            The NFT name | NFT Drop
          </h1>
          <p className="pt-2 text-xl text-green-500">13 / 21 NFT's claimed</p>
        </div>
        <button className="mt-10 h-16 w-full rounded-full bg-red-500 font-bold text-white">
          Mint NFT (0.01 ETH)
        </button>
      </div>
    </div>
  )
}
export default NFTDetailPage
