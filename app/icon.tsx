import { ImageResponse } from 'next/og'

export function generateImageMetadata() {
  return [
    { id: '16', size: { width: 16, height: 16 }, contentType: 'image/png' },
    { id: '32', size: { width: 32, height: 32 }, contentType: 'image/png' },
    { id: '192', size: { width: 192, height: 192 }, contentType: 'image/png' },
    { id: '512', size: { width: 512, height: 512 }, contentType: 'image/png' },
  ]
}

export default function Icon({ id }: { id: string }) {
  const size = parseInt(id)

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'transparent',
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width={size * 0.8}
          height={size * 0.8}
          viewBox="0 0 24 24"
          fill="none"
          stroke="#c4a882" // var(--color-boba)
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M7 4l-1 16c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2L17 4" />
          <path d="M5 4h14" />
          <path d="M6 2h12" />
          <path d="M12 2v-1l4-1" strokeWidth="2" />
          <circle cx="9" cy="18" r="1.5" fill="#c4a882" stroke="none" />
          <circle cx="12" cy="19" r="1.5" fill="#c4a882" stroke="none" />
          <circle cx="15" cy="18" r="1.5" fill="#c4a882" stroke="none" />
          <circle cx="10" cy="15" r="1.5" fill="#c4a882" stroke="none" />
          <circle cx="14" cy="15" r="1.5" fill="#c4a882" stroke="none" />
        </svg>
      </div>
    ),
    {
      width: size,
      height: size,
    }
  )
}
