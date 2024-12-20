import { Platform } from 'react-native';
import { ENV } from '../config/env';

interface CommandResult {
    success: boolean;
    output?: string;
    error?: string;
}

/**
 * Execute a terminal command on the development server
 * @param command The command to execute
 * @returns Promise<CommandResult>
 */
export const executeCommand = async (command: string): Promise<CommandResult> => {
    try {
        const response = await fetch(`${ENV.API_URL}/execute`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ command }),
        });

        const data = await response.json();
        return {
            success: response.ok,
            output: data.output,
            error: data.error,
        };
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error occurred',
        };
    }
};

/**
 * Get the platform-specific command prefix
 * @returns string
 */
export const getCommandPrefix = (): string => {
    return Platform.select({
        ios: '',
        android: 'adb shell ',
        default: '',
    });
};

/**
 * Execute a platform-specific command
 * @param command The command to execute
 * @returns Promise<CommandResult>
 */
export const executePlatformCommand = async (command: string): Promise<CommandResult> => {
    const prefix = getCommandPrefix();
    return executeCommand(`${prefix}${command}`);
};

/**
 * Common terminal commands
 */
export const TerminalCommands = {
    // File system commands
    listFiles: 'ls -la',
    createDirectory: (name: string) => `mkdir ${name}`,
    removeDirectory: (name: string) => `rm -rf ${name}`,
    copyFile: (source: string, dest: string) => `cp ${source} ${dest}`,
    moveFile: (source: string, dest: string) => `mv ${source} ${dest}`,

    // Network commands
    checkConnection: 'ping -c 4 google.com',
    getIpAddress: Platform.select({
        ios: 'ifconfig | grep inet',
        android: 'ip addr show',
        default: 'ipconfig',
    }),

    // Process commands
    listProcesses: 'ps aux',
    killProcess: (pid: number) => `kill ${pid}`,

    // Development server commands
    startServer: 'yarn start',
    startAndroid: 'yarn android',
    startIOS: 'yarn ios',
    buildAndroid: 'cd android && ./gradlew assembleRelease',
    buildIOS: 'cd ios && xcodebuild -workspace YourApp.xcworkspace -scheme YourApp -configuration Release',

    // Custom commands
    clearCache: Platform.select({
        ios: 'rm -rf ~/Library/Developer/Xcode/DerivedData',
        android: 'cd android && ./gradlew clean',
        default: 'yarn cache clean',
    }),
};

/**
 * Execute multiple commands in sequence
 * @param commands Array of commands to execute
 * @returns Promise<CommandResult[]>
 */
export const executeCommandSequence = async (commands: string[]): Promise<CommandResult[]> => {
    const results: CommandResult[] = [];
    
    for (const command of commands) {
        const result = await executeCommand(command);
        results.push(result);
        
        if (!result.success) {
            break;
        }
    }
    
    return results;
};
