export enum RPCTaskType {
    Compile = 1,
    RunStandard = 2,
    RunSubmitAnswer = 3,
    RunInteraction = 4
}

export interface RPCRequest {
    type: RPCTaskType;
    task: any;
}

export interface CompileTask {
    code: string;
    language: string;
    extraFiles: FileContent[];
    binaryName: string;
}

export interface TestcaseDetails {
    type: TestcaseResultType;
    time: number;
    memory: number;
    input?: FileContent;
    output?: FileContent; // Output in test data
    scoringRate: number; // e.g. 0.5
    userOutput?: string;
    userError?: string;
    spjMessage?: string;
    systemMessage?: string;
};

export interface TestcaseResult {
    status: TaskStatus;
    result?: TestcaseDetails;
    errorMessage?: string;
}

export interface SubtaskResult {
    score?: number;
    cases: TestcaseResult[];
}

export enum ErrorType {
    SystemError,
    TestDataError
}

export interface CompilationResult {
    status: TaskStatus;
    message?: string;
}

export interface JudgeResult {
    subtasks?: SubtaskResult[];
}

export interface OverallResult {
    error?: ErrorType;
    systemMessage?: string;
    compile?: CompilationResult;
    judge?: JudgeResult;
}

export interface StandardRunResult {
    time: number;
    memory: number;
    userOutput: string;
    userError: string;
    scoringRate: number;
    spjMessage: string;
    systemMessage?: string;
    result: TestcaseResultType;
}

export interface StandardRunTask {
    testDataName: string;
    inputData: string;
    answerData: string;
    time: number;
    memory: number;
    fileIOInput?: string;
    fileIOOutput?: string;
    userExecutableName: string;
    spjExecutableName?: string;
}

export interface InteractionRunTask {
    testDataName: string;
    inputData: string;
    answerData: string;
    time: number;
    memory: number;
    userExecutableName: string;
    interactorExecutableName: string;
}

export interface AnswerSubmissionRunTask {
    testDataName: string;
    inputData: string;
    answerData: string;
    userAnswer: Buffer;
    spjExecutableName?: string;
}

export interface AnswerSubmissionRunResult {
    scoringRate: number;
    spjMessage: string;
    result: TestcaseResultType;
}

export enum TaskStatus {
    Waiting = 0,
    Running = 1,
    Done = 2,
    Failed = 3,
    Skipped = 4
}

export enum TestcaseResultType {
    Accepted = 1,
    WrongAnswer = 2,
    PartiallyCorrect = 3,
    MemoryLimitExceeded = 4,
    TimeLimitExceeded = 5,
    OutputLimitExceeded = 6,
    FileError = 7, // The output file does not exist
    RuntimeError = 8,
    JudgementFailed = 9, // Special Judge or Interactor fails
    InvalidInteraction = 10
}

export interface FileContent {
    content: string,
    name: string
}

export enum RPCReplyType {
    Started = 1,
    Finished = 2,
    Error = 3
}

export enum ProgressReportType {
    Started = 1,
    Compiled = 2,
    Progress = 3,
    Finished = 4,
    Reported = 5,
}

export interface ProgressReportData {
    taskId: string;
    type: ProgressReportType;
    progress: OverallResult | CompilationResult;
}

export interface RPCReply {
    type: RPCReplyType;
    result?: any;
    error?: string;
}

export interface SerializedBuffer {
    type: string;
    data: Uint8Array;
}

export const redisBinarySuffix = '-bin';
export const redisMetadataSuffix = '-meta';
