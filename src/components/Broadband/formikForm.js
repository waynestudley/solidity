import React from 'react';
import { Formik, Form } from 'formik';

const FormikForm = () => (
    <div>
        <Formik
            initialValues={{ email: "", password: "" }}

            validate={values => {
                const errors = {};

                if (!values.email) errors.email = "Required";

                if (
                    !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)
                ) {
                    errors.email = "You must supply a valid email address";
                }

                if (values.password.length < 8) {
                    errors.password = "Passwords must be at least 8 characters";
                }

                if (values.email === values.password) {
                    errors.password =
                        "Your password shouldn't be the same as your email";
                }

                return errors;
            }}

            onSubmit={(values, { setSubmitting }) => {
                console.log("Submitted Values:", values);
                setTimeout(() => setSubmitting(false), 3 * 1000);
            }}
        >
            {props => (
                <Form>
                    <label htmlFor="email">Email</label>
                    <div>
                        <input
                            name="email"
                            type="email"
                            placeholder="Enter your account email"
                            value={props.values.email}
                            onChange={props.handleChange}
                            onBlur={props.handleBlur}
                            style={{
                                borderColor:
                                    props.errors.email && props.touched.email && "red"
                            }}
                        />
                        {props.errors.email && props.touched.email && (
                            <div style={{ color: "red" }}>{props.errors.email}</div>
                        )}
                    </div>
                    <label htmlFor="password">Password</label>
                    <div>
                        <input
                            name="password"
                            type="password"
                            placeholder="Enter your account password"
                            value={props.values.password}
                            onChange={props.handleChange}
                            onBlur={props.handleBlur}
                            style={{
                                borderColor:
                                    props.errors.password && props.touched.password && "red"
                            }}
                        />
                        {props.errors.password && props.touched.password && (
                            <div style={{ color: "red" }}>{props.errors.password}</div>
                        )}
                    </div>
                    <input
                        type="submit"
                        value="Submit"
                        disabled={props.isSubmitting}
                    />
                    <input
                        type="reset"
                        value="Reset"
                        onClick={props.handleReset}
                        disabled={!props.dirty || props.isSubmitting}
                    />
                </Form>
            )}
        </Formik>
    </div>
);

export default FormikForm;