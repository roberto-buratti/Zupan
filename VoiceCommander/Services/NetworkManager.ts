import _config from '../Assets/Copy/config.json'

export default class NetworkManager {
  // public jwtToken?: string
  // public refreshToken?: string

  public async getConfig(): Promise<any> {
    // const url = `...`
    // const request = new Request(url, { 
    //   method: 'GET',
    //   headers: {
    //     accept: 'application/json',
    //     'content-type': 'application/json'
    //   },
    // })
    // let response = await this._fetchWithTimeout(request, 15);
    // this._validateResponse(response)
    // return response.json()

    // [ROB] fake call. It should get the data from the server
    return _config
  }

  // MARK: - Private

  private _validateResponse(response: any) {
    if (response.status != 200) {
      throw new Error(`Bad status code ${response.status}`)
    }
  }

  private async _fetchWithTimeout(request: Request, timeout: number | undefined = undefined): Promise<Response> {
    let _request: Request
    let abortController: AbortController = new AbortController()

    _request = new Request(request, { signal: abortController.signal })

    const headers = (_request.headers ?? {}) as any
    headers['Request-Timeout'] = timeout

    return new Promise<Response>((resolve, reject) => {
      let timerId = setTimeout(() => {
        abortController.abort()
      },
        timeout! * 1000
      )
      fetch(_request)
        .then((response) => resolve(response))
        .catch((err) => {
          console.log(`*** NetworkManager:fetchWithTimeout: got error for ${request.url}`, err.message)
          if (abortController.signal.aborted)
            reject(new Error('Network Request Timeout'))
          else
            reject(err)
        }
        )
        .finally(() => clearTimeout(timerId))
    })
  }
}