import React from 'react'

interface InitialsAvatarProps {
  name: string
  size?: number
  imageUrl?: string
}

const getInitials = (name: string): string => {
  const nameParts = name.trim().split(' ')
  return nameParts.map((part) => part[0]?.toUpperCase() || '').join('')
}

const generateBackgroundColor = (name: string): string => {
  let hash = 0
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash)
  }
  const hue = hash % 360
  return `hsl(${hue}, 60%, 70%)`
}

const InitialsAvatar: React.FC<InitialsAvatarProps> = ({
  name,
  size = 40,
  imageUrl,
}) => {
  const initials = getInitials(name)
  const backgroundColor = generateBackgroundColor(name)

  const style = {
    width: `${size}px`,
    height: `${size}px`,
    fontSize: `${size / 2.5}px`,
  }

  if (imageUrl && imageUrl.trim() !== '') {
    return (
      <img
        src={imageUrl}
        alt={name}
        className='rounded-full object-cover'
        style={style}
      />
    )
  }

  return (
    <div
      className='rounded-full flex items-center justify-center font-bold text-white'
      style={{ ...style, backgroundColor }}
    >
      {initials}
    </div>
  )
}

export default InitialsAvatar
