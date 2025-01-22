'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useToast } from '@/hooks/use-toast'

export default function RegisterPage() {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const router = useRouter()
  const { toast } = useToast()

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const response = await fetch('/api/users/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, email, password, full_name: fullName }),
      })

      if (response.ok) {
        toast({
          title: 'Registration Successful',
          description: 'You can now log in with your new account.',
        })
        router.push('/login')
      } else {
        const data = await response.json()
        toast({
          title: 'Registration Failed',
          description: data.error || 'An error occurred during registration.',
          variant: 'destructive',
        })
      }
    } catch (error) {
      console.error('Registration error:', error)
      toast({
        title: 'Registration Failed',
        description: 'An unexpected error occurred. Please try again.',
        variant: 'destructive',
      })
    }
  }

  return (
    <div className="max-w-md mx-auto mt-8">
      <h1 className="text-3xl font-bold mb-6">Register</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="username">Username</Label>
          <Input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div>
          <Label htmlFor="fullName">Full Name</Label>
          <Input
            id="fullName"
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
          />
        </div>
        <Button type="submit" className="w-full">Register</Button>
      </form>
    </div>
  )
}

