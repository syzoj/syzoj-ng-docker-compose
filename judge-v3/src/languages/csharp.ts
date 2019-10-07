export const lang =  {
    name: "csharp",
    sourceFileName: "a.cs",
    fileExtension: "cs",
    binarySizeLimit: 5000 * 1024,

    // Note that these two paths are in the sandboxed environment.
    compile: (sourcePath, outputDirectory) => ({
        // To customize the compilation process,
        // write a shell script or some other stuff, 
        // and put it to your sandbox.
        executable: "/usr/bin/compile-dotnet",
        parameters: ["compile-dotnet", sourcePath, outputDirectory, "mcs"],
        time: 5000,
        memory: 1024 * 1024 * 1024,
        process: 10,
        // This is just a redirection. You can simply ignore this
        // if you can specify custom location for message output
        // in the parameter of the compiler, or have redirected the compilation 
        // message to somewhere.
        // An example will be available soon.
        stderr: `${outputDirectory}/message.txt`,
        // We will read this file for message in the output directory.
        messageFile: 'message.txt',
        workingDirectory: outputDirectory
    }),

    run: (binaryDirectory: string,
        workingDirectory: string,
        time: number,
        memory: number,
        stdinFile = null,
        stdoutFile = null,
        stderrFile = null
    ) => ({
        executable: "/usr/bin/mono",
        parameters: ["mono", `${binaryDirectory}/a.exe`],
        time: time,
        memory: memory,
        process: 3,
        stdin: stdinFile,
        stdout: stdoutFile,
        stderr: stderrFile,
        workingDirectory: workingDirectory
    })
};
