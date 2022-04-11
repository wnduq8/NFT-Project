import React, { useCallback, useEffect, useMemo, useState } from 'react'
import {
  useAddress,
  useDisconnect,
  useMetamask,
  useNFTDrop,
} from '@thirdweb-dev/react'
import { GetServerSideProps } from 'next'
import { sanityClient, urlFor } from '../../sanity'
import { Collection } from '../../typings'
import Link from 'next/link'
import { BigNumber } from 'ethers'
import toast, { Toaster } from 'react-hot-toast'

interface Props {
  collection: Collection
}

function NFTDetailPage({ collection }: Props) {
  const [claimedSupply, setClaimedSupply] = useState<number>(0)
  const [totalSupply, setTotalSupply] = useState<BigNumber>()
  const [priceInEth, setPriceInEth] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(true)

  const nftDrop = useNFTDrop(collection.address)

  const connectWithMetamask = useMetamask()
  const address = useAddress()
  const disconnect = useDisconnect()

  const onClickAuth = useCallback(async () => {
    if (address) {
      disconnect()
      return
    }
    await connectWithMetamask()
  }, [address])

  const onClickMintNft = useCallback(() => {
    if (!nftDrop || !address) return

    const quantity = 1

    setLoading(true)
    const notification = toast.loading('Minting...', {
      style: {
        background: 'white',
        color: 'green',
        fontWeight: 'bolder',
        fontSize: '17px',
        padding: '20px',
      },
    })

    try {
      nftDrop
        .claimTo(address, quantity)
        .then(async (tx) => {
          const receipt = tx[0].receipt
          const claimedTokenId = tx[0].id
          const claimedNFT = await tx[0].data()
          toast('Successfully!', {
            duration: 5000,
            style: {
              background: 'green',
              color: 'white',
              fontWeight: 'bolder',
              fontSize: '17px',
              padding: '20px',
            },
          })

          console.log(receipt)
          console.log(claimedTokenId)
          console.log(claimedNFT)
        })
        .catch((err) => {
          console.log(err)
          toast('error', {
            duration: 5000,
            style: {
              background: 'red',
              color: 'white',
              fontWeight: 'bolder',
              fontSize: '17px',
              padding: '20px',
            },
          })
        })
        .finally(() => {
          toast.dismiss(notification)
          setLoading(false)
        })
    } catch (e) {
      console.log(e)
    }
  }, [nftDrop, address])

  const disabled = useMemo(
    () => loading || claimedSupply === totalSupply?.toNumber() || !address,
    [loading, claimedSupply, totalSupply, address]
  )

  useEffect(() => {
    if (!nftDrop) return
    const fetchPrice = async () => {
      const claimConditions = await nftDrop.claimConditions.getAll()
      setPriceInEth(claimConditions?.[0].currencyMetadata.displayValue)
    }
    fetchPrice()
  }, [nftDrop])

  useEffect(() => {
    if (!nftDrop) return

    const fetchNFTDropData = async () => {
      setLoading(true)
      try {
        const claimed = await nftDrop.getAllClaimed()
        const total: BigNumber = await nftDrop.totalSupply()

        setClaimedSupply(claimed.length)
        setTotalSupply(total)
      } catch (e) {
        console.log(e)
      } finally {
        setLoading(false)
      }
    }

    fetchNFTDropData()
  }, [nftDrop])

  return (
    <div className="flex h-screen flex-col lg:grid lg:grid-cols-10">
      <Toaster position="bottom-center" />
      <div className="bg-gradient-to-br from-cyan-800 to-rose-500  lg:col-span-4">
        <div className="flex flex-col items-center justify-center py-2 lg:min-h-screen">
          <div className="rounded-xl bg-gradient-to-br from-yellow-400 to-purple-600 p-2">
            <img
              src={urlFor(collection.previewImage).url()}
              alt="nft-img"
              className="w-44 rounded-xl object-cover lg:h-96 lg:w-72"
            />
          </div>
          <div className="space-y-2 p-5 text-center">
            <h1 className="text-4xl font-bold text-white">
              {collection.nftCollectionName}
            </h1>
            <h2 className="text-xl text-gray-300">{collection.title}</h2>
          </div>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-12 lg:col-span-6">
        <header className="flex items-center justify-between">
          <Link href={'/'}>
            <h1 className="w-52 cursor-pointer text-xl font-extralight sm:w-80">
              The{' '}
              <span className="font-extrabold underline decoration-pink-600/50">
                {collection.nftCollectionName}
              </span>{' '}
              NFT Market Place
            </h1>
          </Link>
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
            src={urlFor(collection.mainImage).url()}
            alt="nft-img"
            className="w-80 object-cover pb-10 lg:h-40"
          />
          <h1 className="text-3xl font-bold lg:text-5xl lg:font-extrabold">
            {collection.description}
          </h1>
          {loading ? (
            <p className="animate-bounce pt-2 text-xl text-green-500">
              loading
            </p>
          ) : (
            <p className="pt-2 text-xl text-green-500">
              {claimedSupply} / {totalSupply?.toString()} NFT's claimed
            </p>
          )}
          {loading && (
            <img
              className="h-80 w-80 object-contain"
              src="https://cdn.hackernoon.com/images/0*4Gzjgh9Y7Gu8KEtZ.gif"
              alt="loading"
            />
          )}
        </div>
        <button
          onClick={onClickMintNft}
          disabled={disabled}
          className="mt-10 h-16 w-full rounded-full bg-red-500 font-bold text-white disabled:bg-gray-400"
        >
          {loading ? (
            <>Loading</>
          ) : claimedSupply === totalSupply?.toNumber() ? (
            <>SOLD OUT</>
          ) : !address ? (
            <>Sign in to Mint</>
          ) : (
            <span className="font-bold">Mint NFT ({priceInEth} ETH)</span>
          )}
        </button>
      </div>
    </div>
  )
}
export default NFTDetailPage

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const query = `*[_type == "collection" && slug.current == $id] [0]{
  _id,
  title,
  address,
  nftCollectionName,
  description,
  mainImage {
    asset
},
  previewImage {
  asset
},
slug {
  current
},
creator-> {
  _id,
  name,
  address,
  slug {
  current
},
},
}`

  const collection = await sanityClient.fetch(query, {
    id: params?.id,
  })

  if (!collection) {
    return {
      notFound: true,
    }
  }

  return {
    props: {
      collection,
    },
  }
}
