import Router from './router/Router'
import { QueryClientProvider, QueryClient } from '@tanstack/react-query'

const queryClient = new QueryClient()
function App() {
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <Router />
      </QueryClientProvider>
    </>
  )
}

export default App
