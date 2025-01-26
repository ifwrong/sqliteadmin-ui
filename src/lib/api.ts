import type { Condition, Credentials } from './types'

export class API {
  constructor(private credentials: Credentials) {}

  async ping(): Promise<APIResponse<PingResponse>> {
    return this._request({
      method: 'POST',
      body: JSON.stringify({
        query: 'Ping',
      }),
    })
  }

  async fetchTables(): Promise<APIResponse<FetchTablesResponse>> {
    return this._request({
      method: 'POST',
      body: JSON.stringify({
        query: 'ListTables',
      }),
    })
  }

  async fetchTableData(
    tableName: string,
    includeInfo: boolean,
    condition: Condition,
  ): Promise<APIResponse<FetchTableResponse>> {
    return this._request({
      method: 'POST',
      body: JSON.stringify({
        query: 'GetTable',
        params: {
          tableName,
          includeInfo,
          condition,
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
        query: 'DeleteRows',
        params: {
          tableName,
          ids,
        },
      }),
    })
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
      if (!res.ok) {
        throw new Error('Failed to fetch data')
      }
      const data = await res.json()
      return successResponse(data, res.status)
    } catch (error) {
      let errString
      if (error instanceof Error) {
        errString = error.message
      } else {
        errString = 'An unknown error occurred'
      }

      return errResponse(errString, 500)
    }
  }
}

function errResponse(error: string, statusCode: number): ErrorResponse {
  return {
    ok: false,
    error,
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
  error: string
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
