// src/AuthProvider.tsx
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
  useCallback,
} from "react"
import {supabase} from "@/lib/supabase-client.ts"
import {type Profile, ProfileModel} from "@/app/users/model/profile.model.ts"
import type {User} from "@supabase/supabase-js"

type AuthContextType = {
  user: any | null
  profile: Profile | null
  loading: boolean
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  loading: true,
})

export function AuthProvider({children}: {children: ReactNode}) {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)

  const loadUserProfileData = useCallback(async (user: User | null) => {
    setLoading(true)
    if (user) {
      const profileModel = new ProfileModel(user.id)
      const profileData = await profileModel.loadData()
      setProfile(profileData)
    } else {
      setProfile(null)
    }
    console.log(profile, "profile data");
    setLoading(false)
  }, [])

  //check on user id to change. we don't want to change everytime AuthState is being changed. Here we load all user data
  useEffect(() => {
    if (user?.id) {
      loadUserProfileData(user)
    } else {
      setLoading(false);
    }
  }, [user?.id, loadUserProfileData])

  useEffect(() => {
    // Listen for auth state changes
    const {data: listener} = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => {
      listener.subscription.unsubscribe()
    }
  }, [])

  const contextValue = {
    loading,
    profile,
    user,
  }

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext)
