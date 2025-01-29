import type { Condition, Credentials } from './types'

export class API {
  private _interceptors: (<TData>(
    response: APIResponse<TData>,
  ) => APIResponse<TData>)[] = []

  constructor(private credentials: Credentials) { }

  async ping(): Promise<APIResponse<PingResponse>> {
    return this._request({
      method: 'POST',
      body: JSON.stringify({
        command: 'Ping',
      }),
    })
  }

  async fetchTables(): Promise<APIResponse<FetchTablesResponse>> {
    return this._request({
      method: 'POST',
      body: JSON.stringify({
        command: 'ListTables',
      }),
    })
  }

  async fetchTableData({
    tableName,
    includeInfo,
    condition,
    limit = 100,
    offset = 0,
  }: {
    tableName: string
    includeInfo: boolean
    condition: Condition
    limit?: number
    offset?: number
  }): Promise<APIResponse<FetchTableResponse>> {
    return this._request({
      method: 'POST',
      body: JSON.stringify({
        command: 'GetTable',
        params: {
          tableName,
          includeInfo,
          condition,
          limit,
          offset,
        },
      }),
    })
  }

  async deleteRows(
    tableName: string,
    ids: string[],
  ): Promise<APIResponse<DeleteRowsResponse>> {
    return this._request({
      method: 'POST',
      body: JSON.stringify({
        command: 'DeleteRows',
        params: {
          tableName,
          ids,
        },
      }),
    })
  }

  async updateRow(
    tableName: string,
    row: Partial<TableRow>,
  ): Promise<APIResponse<UpdateRowResponse>> {
    return this._request({
      method: 'POST',
      body: JSON.stringify({
        command: 'UpdateRow',
        params: {
          tableName,
          row,
        },
      }),
    })
  }

  addInterceptor(
    interceptor: <TData>(response: APIResponse<TData>) => APIResponse<TData>,
  ) {
    this._interceptors.push(interceptor)

    return this
  }

  async _request<TData>(options: RequestInit): Promise<APIResponse<TData>> {
    const mergedOptions = { ...options }
    mergedOptions.headers = {
      ...options.headers,
      Authorization: `${this.credentials.username}:${this.credentials.password}`,
      'Content-Type': 'application/json',
    } as Record<string, string>

    try {
      const res = await fetch(this.credentials.endpoint, mergedOptions)
      const data = await res.json()
      if (res.ok) {
        return pipeWith(successResponse(data, res.status), this._interceptors)
      }
      return pipeWith(
        errResponse(data?.message ?? '', res.status),
        this._interceptors,
      )
    } catch (error) {
      console.error(error)
      return errResponse('An unexpected error occurred', 500)
    }
  }
}

function errResponse(message: string, statusCode: number): ErrorResponse {
  return {
    ok: false,
    message,
    statusCode,
  }
}

function successResponse<TData>(
  data: TData,
  statusCode: number,
): SuccessResponse<TData> {
  return {
    ok: true,
    data,
    statusCode,
  }
}

type APIResponse<TData> = SuccessResponse<TData> | ErrorResponse

type ErrorResponse = {
  ok: false
  message: string
  statusCode: number
}

type SuccessResponse<TData> = {
  ok: true
  data: TData
  statusCode: number
}

type PingResponse = {
  status: string
}

type FetchTablesResponse = {
  tables: string[]
}

export type Column = {
  cid: number
  name: string
  type: string
  notnull: 0 | 1
  dflt_value: string | null
  pk: 0 | 1
}

export type TableInfo = {
  columns: Column[]
  count: number
}

export type FetchTableResponse = {
  rows: TableRow[]
  tableInfo?: TableInfo
}
export type TableRow = Record<string, unknown>

type DeleteRowsResponse = {
  rowsAffected: number
}

type UpdateRowResponse = {
  status: string
}

function pipeWith<TData>(
  response: APIResponse<TData>,
  funcs: (<TData>(response: APIResponse<TData>) => APIResponse<TData>)[],
) {
  return funcs.reduce((acc, func) => func(acc), response)
}
