import { createHandleWorkerRequest, type WorkerEnv } from './handler'

const handleWorkerRequest = createHandleWorkerRequest()

export default {
  fetch: (request, env) => handleWorkerRequest(request, env),
} satisfies ExportedHandler<WorkerEnv>
