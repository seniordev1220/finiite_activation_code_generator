import { ActivationForm } from '@/components/activation-form'

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Account Activation</h1>
          <p className="text-gray-600 mt-2">Generate your unique activation code</p>
        </div>
        <ActivationForm />
      </div>
    </div>
  )
}
