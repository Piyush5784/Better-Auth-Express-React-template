import { createFileRoute } from '@tanstack/react-router'

function Dashboard() {
  return <div>Dashboard</div>
}

export const Route = createFileRoute('/dashboard/')({
  component: Dashboard,
})
