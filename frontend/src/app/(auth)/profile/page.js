'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/hooks/use-toast'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

export default function ProfilePage() {
  const [profile, setProfile] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem('token')
      if (!token) {
        router.push('/login')
        return
      }

      try {
        const response = await fetch('/api/users/profile', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        })

        if (response.ok) {
          const data = await response.json()
          setProfile(data)
        } else {
          throw new Error('Failed to fetch profile')
        }
      } catch (error) {
        console.error('Error fetching profile:', error)
        toast({
          title: 'Error',
          description: 'Failed to load profile. Please try again.',
          variant: 'destructive',
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchProfile()
  }, [router, toast])

  const handleSubmit = async (e) => {
    e.preventDefault()
    // Implement profile update logic here
    toast({
      title: 'Profile Updated',
      description: 'Your profile has been updated successfully.',
    })
  }

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (!profile) {
    return <div>Error loading profile</div>
  }

  return (
    <div className="max-w-md mx-auto mt-8">
      <h1 className="text-3xl font-bold mb-6">Your Profile</h1>
      <div className="flex items-center justify-center mb-6">
        <Avatar className="h-24 w-24">
          <AvatarImage src={profile.profile_picture_url || "/placeholder.svg?height=96&width=96"} alt={profile.full_name} />
          <AvatarFallback>{profile.full_name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
        </Avatar>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="username">Username</Label>
          <Input
            id="username"
            value={profile.username}
            readOnly
          />
        </div>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={profile.email}
            readOnly
          />
        </div>
        <div>
          <Label htmlFor="fullName">Full Name</Label>
          <Input
            id="fullName"
            type="text"
            value={profile.full_name}
            onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
          />
        </div>
        <div>
          <Label htmlFor="bio">Bio</Label>
          <Textarea
            id="bio"
            value={profile.bio || ''}
            onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
            rows={4}
          />
        </div>
        <Button type="submit">Update Profile</Button>
      </form>
    </div>
  )
}

