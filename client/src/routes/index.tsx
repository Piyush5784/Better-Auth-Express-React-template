import { createFileRoute } from '@tanstack/react-router'
import HomePage from './landing'

export const Route = createFileRoute('/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <HomePage />
}
