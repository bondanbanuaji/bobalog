import { ImageResponse } from 'next/og'

export const size = {
  width: 1200,
  height: 630,
}
export const contentType = 'image/png'

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(to bottom right, #1a1a1c, #0d0c0e)',
          color: 'white',
          padding: '80px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '30px' }}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="140"
            height="140"
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
          <div
            style={{
              fontSize: 120,
              fontWeight: 800,
              letterSpacing: '-0.05em',
              display: 'flex',
              backgroundClip: 'text',
              backgroundImage: 'linear-gradient(to right, #ffffff, #c4a882)',
              color: 'transparent',
            }}
          >
            Bobalog
          </div>
        </div>
        
        <div
          style={{
            fontSize: 48,
            fontWeight: 500,
            marginTop: 40,
            color: '#a1a1a3', // var(--color-text-muted)
            textAlign: 'center',
            maxWidth: '80%',
          }}
        >
          Katalog wishlist Shopee pribadimu yang minimalis dan terorganisir
        </div>
      </div>
    ),
    { ...size }
  )
}
