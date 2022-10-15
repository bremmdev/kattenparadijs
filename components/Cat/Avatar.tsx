import React from 'react'
import Image from 'next/image'

type Props = {
  url: string
}

const Avatar = (props: Props) => {
  return (
    <Image src={props.url} width="42" height="42"/>
  )
}

export default Avatar