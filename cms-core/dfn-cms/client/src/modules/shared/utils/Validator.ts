import FastestValidator from 'fastest-validator';

class Validator {
    private static instance: Validator;
    private validator: FastestValidator;
    private validatingSchemas: { [key: string]: any };

    private constructor() {
        this.validator = new FastestValidator();
        this.validatingSchemas = {};
    }

    public static getInstance(): Validator {
        if (!Validator.instance) {
            Validator.instance = new Validator();
        }

        return Validator.instance;
    }

    public setValidatorSchema(key: string, schema: any) {
        if (!Object.keys(this.validatingSchemas).includes(key)) {
            const check = this.validator.compile(schema);
            this.validatingSchemas[key] = check;
        }
    }

    public getValidator(key: string) {
        return this.validatingSchemas[key];
    }

    public validateData(key: string, data: any): [boolean, any] {
        const check = this.getValidator(key);
        let isValid = false;
        let errors: any[] = [];

        if (check) {
            const result = check(data);
            if (result === true) {
                isValid = true;
            } else {
                isValid = false;
                errors = result;
            }
        }
        else{
            errors.push('Validating schema not defined');
        }

        return [isValid, errors];
    }
}

const validatorInstance = Validator.getInstance();
export default validatorInstance;
