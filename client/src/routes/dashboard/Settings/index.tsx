import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard/Settings/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/dashboard/Settings/"!</div>
}
