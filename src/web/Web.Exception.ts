import { Exception } from '@trapize/core';

/**
 *
 *
 * @export
 * @class WebException
 * @extends {Exception}
 */
export class WebException extends Exception {
    /**
     *
     *
     * @type {string}
     * @memberof WebException
     */
    public _source: string = 'Core.Web';
}

/**
 *
 *
 * @export
 * @class InvalidRouteDefinitionException
 * @extends {WebException}
 */
export class InvalidRouteDefinitionException extends WebException {}
/**
 *
 *
 * @export
 * @class UnhandledException
 * @extends {WebException}
 */
export class UnhandledException extends WebException {
    /**
     *
     *
     * @returns {{[key: string]: any}}
     * @memberof UnhandledException
     */
    public ToJSON(): {[key: string]: any} {
        return {
            message: this.Message
        };
    }
}

export const WebExceptions = {
    InvalidRouteDefinitionException: InvalidRouteDefinitionException,
    UnhandledException: UnhandledException
}