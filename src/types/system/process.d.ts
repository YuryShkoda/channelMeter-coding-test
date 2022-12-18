declare namespace NodeJS {
  export interface Process {
    logger: import('winston').Logger
  }
}
