// src/app/admin/settings/page.tsx
import { prisma } from '@/lib/prisma'
import SettingsForm from '@/components/admin/SettingsForm'

export default async function AdminSettingsPage() {
  const settings = await prisma.setting.findMany()
  const map = Object.fromEntries(settings.map((s) => [s.key, s.value]))

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-dark mb-6">Settings</h1>
      <SettingsForm initialSettings={map} />
    </div>
  )
}
