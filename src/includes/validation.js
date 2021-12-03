import {
  Field as VeeField,
  Form as VeeForm,
  defineRule,
  ErrorMessage,
  configure,
} from "vee-validate";
import {
  required,
  min,
  max,
  alpha_spaces as alphaSpaces,
  email,
  min_value as minimumValue,
  max_value as maximumValue,
  confirmed,
} from "@vee-validate/rules";

export default {
  install(app) {
    app.component("VeeField", VeeField);
    app.component("VeeForm", VeeForm);
    app.component("ErrorMessage", ErrorMessage);

    defineRule("required", required);
    defineRule("tos", required);
    defineRule("min", min);
    defineRule("max", max);
    defineRule("alpha_spaces", alphaSpaces);
    defineRule("email", email);
    defineRule("min_value", minimumValue);
    defineRule("max_value", maximumValue);
    defineRule("passwords_mismatch", confirmed);

    configure({
      generateMessage: (ctx) => {
        const messages = {
          required: `The field ${ctx.field} is required.`,
          min: `The field ${ctx.field} is too short.`,
          max: `The field ${ctx.field} is too long.`,
          alpha_spaces: `The field ${ctx.field} must only contain alphabets and spaces.`,
          email: `The field ${ctx.field} must be in valid email format.`,
          passwords_mismatch: "Passwords do not match",
          tos: "You must accept the terms of service",
        };

        const message = messages[ctx.rule.name]
          ? messages[ctx.rule.name]
          : `The field ${ctx.field} is invalid`;

        return message;
      },
    });
  },
};
