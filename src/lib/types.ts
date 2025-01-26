export type Credentials = {
  username: string
  password: string
  endpoint: string
}

export type Operator = 'eq' | 'like' | 'neq' | 'lt' | 'lte' | 'gt' | 'gte'

export type LogicalOperator = 'and' | 'or'

export type Filter = {
  column: string
  operator: Operator
  value: string
}

export type Condition = {
  cases: (Condition | Filter)[]
  logicalOperator: LogicalOperator
}
