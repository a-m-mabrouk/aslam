/* eslint-disable @typescript-eslint/no-explicit-any */
import { TextInputProps } from "flowbite-react";
import { InputText } from "../textInput";

export default function TextInputLang({
  label_ar,
  label_en,
  className,
  name,
  values,
  errors,
  touched,
  ...props
}: TextInputProps &
  React.RefAttributes<HTMLInputElement> & {
    label_ar?: string;
    label_en?: string;
    values: {
      [key: string]: any;
    };
    errors: {
      [key: string]: any;
    };
    touched: {
      [key: string]: any;
    };
  }) {
  return (
    <div className="grid gap-2">
      <div style={{ direction: "ltr" }}>
        <InputText
          label={label_en}
          className={className}
          name={`${name}_en`}
          value={values[`${name}_en`] || ""}
          helperText={touched[`${name}_en`] && errors[`${name}_en`]}
          {...props}
          placeholder={`Enter ${label_en}`}
        />
      </div>
      <div style={{ direction: "rtl" }}>
        <InputText
          label={label_ar}
          className={className}
          name={`${name}_ar`}
          value={values[`${name}_ar`] || ""}
          helperText={touched[`${name}_ar`] && errors[`${name}_ar`]}
          {...props}
          placeholder={`ادخل ${label_ar}`}
        />
      </div>
    </div>
  );
}
