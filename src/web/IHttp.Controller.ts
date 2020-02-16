import { ControllerAction } from './Controller.Action';

/**
 *
 *
 * @export
 * @interface IHttpController
 */
export interface IHttpController {
    [key: string]: ControllerAction;
}