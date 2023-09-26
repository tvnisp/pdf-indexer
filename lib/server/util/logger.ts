import pino, {LogFn, Logger, LoggerOptions} from 'pino';
/**
 * src: https://getpino.io/#/docs/api?id=logger-instance
 */
function logMethod(this: Logger, args: Parameters<LogFn>, method: LogFn) {
	if (args.length === 2) {
		// eslint-disable-next-line no-param-reassign
		args[0] = `${args[0]} %j`;
	}
	method.apply(this, args);
}

export function getLogger(LoggerOptionProps?: LoggerOptions) {
	// Identify the call position of the api
	const options: LoggerOptions = {
		hooks: {logMethod},
		serializers: {error: pino.stdSerializers.err},
		level: 'debug' as LoggerOptions['level'],
		...LoggerOptionProps,
	};
	const logger = pino(options, pino.destination({sync: true}));
	return logger;
}
