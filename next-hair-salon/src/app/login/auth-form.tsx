'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Eye, EyeOff, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { login, signup } from './actions'

export default function AuthForm() {
    const [isLogin, setIsLogin] = useState(true)
    const [isLoading, setIsLoading] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const [error, setError] = useState('')
    const router = useRouter()

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        setIsLoading(true)
        setError('')

        const formData = new FormData(event.currentTarget)

        try {
            const result = isLogin ? await login(formData) : await signup(formData)
            if (result.success) {
                router.push('/admin') // Redirect to dashboard after successful auth
            } else {
                result.message ? setError(result.message) : setError('An unexpected error occurred. Please try again.') // Display error message from server
            }

        } catch (err) {
            setError('An unexpected error occurred. Please try again.')
        } finally {
            setIsLoading(false)
        }
    }

    const toggleMode = () => setIsLogin(!isLogin)

    return (
        <Card className="w-full max-w-md mx-auto">
            <CardHeader>
                <CardTitle>{isLogin ? 'Log In' : 'Sign Up'}</CardTitle>
                <CardDescription>
                    {isLogin ? 'Welcome back! Please log in to your account.' : 'Create your account to get started.'}
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            name="email"
                            type="email"
                            placeholder="you@example.com"
                            required
                            autoComplete="email"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="password">Password</Label>
                        <div className="relative">
                            <Input
                                id="password"
                                name="password"
                                type={showPassword ? 'text' : 'password'}
                                placeholder="••••••••"
                                required
                                autoComplete={isLogin ? 'current-password' : 'new-password'}
                            />
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="absolute right-2 top-1/2 -translate-y-1/2"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                <span className="sr-only">{showPassword ? 'Hide password' : 'Show password'}</span>
                            </Button>
                        </div>
                    </div>
                    {!isLogin && (
                        <div className="space-y-2">
                            <Label htmlFor="name">Full Name</Label>
                            <Input
                                id="name"
                                name="name"
                                placeholder="John Doe"
                                required={!isLogin}
                                autoComplete="name"
                            />
                        </div>
                    )}
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={isLogin ? 'login' : 'signup'}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
                        >
                            <Button type="submit" className="w-full" disabled={isLoading}>
                                {isLoading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        {isLogin ? 'Logging in...' : 'Signing up...'}
                                    </>
                                ) : (
                                    isLogin ? 'Log In' : 'Sign Up'
                                )}
                            </Button>
                        </motion.div>
                    </AnimatePresence>
                    {error && <p className="text-sm text-red-500 mt-2">{error}</p>}
                </form>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
                <Button variant="link" onClick={toggleMode} className="w-full">
                    {isLogin ? "Don't have an account? Sign Up" : 'Already have an account? Log In'}
                </Button>
            </CardFooter>
        </Card>
    )
}
