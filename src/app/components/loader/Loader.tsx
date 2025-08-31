import React, { useMemo, CSSProperties } from 'react'

// Type definitions
type LoadingType = 'save' | 'loading' | 'processing'

interface RecordLoadingProps {
  isloading: boolean
  loadingtype?: LoadingType
  loadingtext?: string
  filesize?: number | string
}

interface StylesMap {
  readonly [key: string]: CSSProperties
}

type TextMap = Readonly<{
  [K in LoadingType]: string
}>

// Main component
const RecordLoading: React.FC<RecordLoadingProps> = React.memo(({ 
  isloading, 
  loadingtype, 
  loadingtext, 
  filesize 
}) => {
  // Memoized text mapping with strict typing
  const textMap = useMemo<TextMap>(() => ({
    save: 'Saving....',
    loading: 'loading....',
    processing: 'Processing'
  }), [])

  // Compute display text with type safety
  const displayText = useMemo<string>(() => {
    const typeText: string = loadingtype ? (textMap[loadingtype] ?? '') : ''
    const mainText: string = loadingtext ?? ''
    return `${mainText} ${typeText}`.trim()
  }, [loadingtext, loadingtype, textMap])

  // Strongly typed styles object
  const styles: StylesMap = {
    recordloadingboxBase: {
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      backgroundColor: 'rgba(17, 13, 13, 0.36)',
      zIndex: 9998,
      transition: 'transform 0.3s ease-in-out'
    },
    recordloadingboxON: {
      transform: 'scale(1)'
    },
    recordloadingboxOFF: {
      transform: 'scale(0)'
    },
    recordloadingCustomBox: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      width: '100%',
      height: '100%'
    },
    cusboxseconddiv: {
      display: 'flex',
      width: '100%',
      height: '100%',
      justifyContent: 'center',
      alignItems: 'center'
    },
    loadingContainer: {
      display: 'flex',
      alignItems: 'center',gap: '1rem',
    },
    spinnerSection: {
      flexShrink: 0,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center'
    },
    textSection: {
      display: 'flex',
      alignItems: 'center',
      flex: 1
    },
    customloadingsecond: {
      display: 'flex',
      justifyContent: 'flex-start',
      alignItems: 'center',
      width: '100%'
    },
    loadingText: {
      fontSize: '1rem',
      color: '#810416ff',
      fontWeight: 500,
      whiteSpace: 'nowrap' as const,
      userSelect: 'none' as const
    },
    load_wrapp: {
      width: '40px',
      height: '40px',
      position: 'relative'
    },
    load_4: {
      width: '100%',
      height: '100%',
      position: 'relative'
    },
    ring_1: {
      width: '100%',
      height: '100%',
      border: '3px dashed transparent',
      borderTop: '3px solid #b33b3bff',
      borderRadius: '50%',
      animation: 'spin 1s linear infinite'
    }
  }

  // Combine base styles with conditional styles
  const containerStyle: CSSProperties = {
    ...styles.recordloadingboxBase,
    ...(isloading ? styles.recordloadingboxON : styles.recordloadingboxOFF)
  }

  // Early return if not loading - performance optimization
  if (!isloading) {
    return (
      <div style={containerStyle}>
        <div style={styles.recordloadingCustomBox} />
      </div>
    )
  }

  return (
    <>
      {/* CSS animations - kept inline for self-contained component */}
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
      
      <div style={containerStyle}>
        <div style={styles.recordloadingCustomBox}>
          <div style={styles.cusboxseconddiv}>
            <div style={styles.loadingContainer}>
              
              {/* Loading spinner section */}
              <div style={styles.spinnerSection}>
                <div style={styles.load_wrapp}>
                  <div style={styles.load_4}>
                    <div style={styles.ring_1} />
                  </div>
                </div>
              </div>

              {/* Text display section */}
              <div style={styles.textSection}>
                <div style={styles.customloadingsecond}>
                  <span style={styles.loadingText}>
                    {displayText}
                  </span>
                </div>
              </div>
              
            </div>
          </div>
        </div>
      </div>
    </>
  )
})


RecordLoading.displayName = 'RecordLoading'

export default RecordLoading
