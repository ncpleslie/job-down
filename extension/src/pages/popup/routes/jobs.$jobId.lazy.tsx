import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/jobs/$jobId')({
  component: () => <div>Hello /jobs/$jobId!</div>
})