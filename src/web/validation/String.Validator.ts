import { Validator } from './Validator';
import { IValidationError } from './IValidation.Error';


/**
 *
 *
 * @export
 * @class StringValidator
 * @extends {Validator<string>}
 */
export class StringValidator extends Validator<string> {
    
    /**
     *
     *
     * @private
     * @type {Set<string>}
     * @memberof StringValidator
     */
    private list: Set<string> = new Set<string>();
    /**
     *
     *
     * @private
     * @type {number}
     * @memberof StringValidator
     */
    private max?: number;
    /**
     *
     *
     * @private
     * @type {number}
     * @memberof StringValidator
     */
    private min?: number;
    /**
     *
     *
     * @private
     * @type {boolean}
     * @memberof StringValidator
     */
    private isWhitelist: boolean = true;
    /**
     *
     *
     * @private
     * @type {RegExp}
     * @memberof StringValidator
     */
    private pattern?: RegExp;

    /**
     *Creates an instance of StringValidator.
     * @param {string} name
     * @param {string} [message='Invalid Value']
     * @memberof StringValidator
     */
    public constructor(name: string, private message: string = 'Invalid Value') {
        super(name);
    }

    /**
     *
     *
     * @param {number} num
     * @returns {this}
     * @memberof StringValidator
     */
    public Max(num: number): this {
        this.max = num;
        return this;
    }
    
    /**
     *
     *
     * @param {number} num
     * @returns {this}
     * @memberof StringValidator
     */
    public Min(num: number): this {
        this.min = num;
        return this;
    }

    /**
     *
     *
     * @returns {this}
     * @memberof StringValidator
     */
    public Alpha(): this {
        this.LowerCase();
        this.UpperCase();
        return this;
    }

    /**
     *
     *
     * @returns {this}
     * @memberof StringValidator
     */
    public LowerCase(): this {
        this.list.add('a-z')
        return this;
    }

    /**
     *
     *
     * @returns {this}
     * @memberof StringValidator
     */
    public UpperCase(): this {
        this.list.add('A-Z');
        return this;
    }

    /**
     *
     *
     * @returns {this}
     * @memberof StringValidator
     */
    public Numeric(): this {
        this.list.add('0-9');
        return this;
    }

    /**
     *
     *
     * @returns {this}
     * @memberof StringValidator
     */
    public Alphanumeric(): this {
        this.Alpha();
        this.Numeric();
        return this;
    }

    /**
     *
     *
     * @returns {this}
     * @memberof StringValidator
     */
    public Whitespace(): this {
        this.list.add('\s');
        return this;
    }

    /**
     *
     *
     * @returns {this}
     * @memberof StringValidator
     */
    public SingleQuotes(): this {
        this.list.add(`\'`);
        return this;
    }

    /**
     *
     *
     * @returns {this}
     * @memberof StringValidator
     */
    public DoubleQuotes(): this {
        this.list.add('\"');
        return this;
    }

    /**
     *
     *
     * @returns {this}
     * @memberof StringValidator
     */
    public Underscore(): this {
        this.list.add('_');
        return this;
    }

    /**
     *
     *
     * @returns {this}
     * @memberof StringValidator
     */
    public Hypen(): this {
        this.list.add('-');
        return this;
    }

    /**
     *
     *
     * @param {...string[]} items
     * @returns {this}
     * @memberof StringValidator
     */
    public Special(...items: string[]): this {
        items.forEach(item => this.list.add(item));
        return this;
    }

    /**
     *
     *
     * @returns {this}
     * @memberof StringValidator
     */
    public Blacklist(): this {
        this.isWhitelist = false;
        return this;
    }

    /**
     *
     *
     * @param {RegExp} pattern
     * @returns {this}
     * @memberof StringValidator
     */
    public Pattern(pattern: RegExp): this {
        this.pattern = pattern;
        return this;
    }
    
    /**
     *
     *
     * @protected
     * @param {string} value
     * @param {(e?: IValidationError, v?: string) => void} callback
     * @returns {void}
     * @memberof StringValidator
     */
    protected doValidate(value: string, callback: (e?: IValidationError, v?: string) => void): void {
       

        const regex = this.pattern ? this.pattern : this.list.size > 0 ? new RegExp((this.isWhitelist ? '^' : '') +'[' + (this.isWhitelist ? '^' : '') + Array.from(this.list.values()).join('') + ']'+ (this.isWhitelist ? '$' : '')) : undefined;
        const errors: string[] = [];

        if(this.max && value.length > this.max) {
            errors.push(this.message);
        }

        if(this.min && value.length < this.min) {
            errors.push(this.message);
        }

        if(regex && regex.test(value)) {
            errors.push(this.message);
        }
        
        if(errors.length > 0) {
            callback({name: this.name, errors: errors});
            return;
        }
        callback(undefined, value);
    }
}