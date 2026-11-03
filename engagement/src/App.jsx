// import React, { useState } from 'react'
// import HeroSection from './components/HeroSection'
// import InvitationText from './components/InvitationText'
// import './index.css'

// export default function App() {
//   const [showInvitation, setShowInvitation] = useState(false)

//   return (
//     <div className="app-root">
//       {!showInvitation ? (
//         <HeroSection onNext={() => setShowInvitation(true)} />
//       ) : (
//         <InvitationText />
//       )}
//     </div>
//   )
// }

// App.js
import React, { useEffect, useState } from 'react'
import HeroSection from './components/HeroSection'
import InvitationText from './components/InvitationText'
import AOS from 'aos'
import 'aos/dist/aos.css'
import './index.css'

export default function App() {
  const [showInvitation, setShowInvitation] = useState(false)

  useEffect(() => {
    AOS.init({
      duration: 700,
      once: true,
      easing: 'ease-in-out',
    })
  }, [])

  // Refresh AOS when the content changes (e.g. showInvitation toggles)
  useEffect(() => {
    AOS.refresh()
  }, [showInvitation])

  return (
    <div className="app-root">
      {!showInvitation ? (
        <HeroSection onNext={() => setShowInvitation(true)} />
      ) : (
        <InvitationText />
      )}
    </div>
  )
}
