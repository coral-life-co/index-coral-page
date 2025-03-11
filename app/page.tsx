import { DashboardLayout } from "@/components/DashboardLayout"
import { SplashScreen } from '@/components/splash-screen'
import { Logo } from '@/components/logo'

export default function Home() {
  return <>    
   <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 pointer-events-none">
    <Logo />
  </div>

    <DashboardLayout />
    <SplashScreen />

  </>
}

