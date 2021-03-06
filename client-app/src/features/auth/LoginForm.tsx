import React, { useContext } from "react";
import { Form as FinalForm, Field } from "react-final-form";
import { Form, Header } from 'semantic-ui-react';
import TextInput from '../../app/common/form/TextInput';
import { Button } from "semantic-ui-react";
import { RootStoreContext } from "../../app/stores/rootStore";
import { IAuthFormValues } from "../../app/models/user";
import { FORM_ERROR } from "final-form";
import { combineValidators, isRequired } from "revalidate";
import ErrorMessage from '../../app/common/form/ErrorMessage';

const validate = combineValidators({
    email: isRequired('email'),
    password: isRequired('password')
})

const LoginForm = () => {
  const rootStore = useContext(RootStoreContext);
  const {login} = rootStore.authStore;

  return (
    <FinalForm
      onSubmit={(values: IAuthFormValues) => login(values).catch(error => ({
          [FORM_ERROR]: error
      }))}
      validate={validate}
      render={({ handleSubmit, submitting, submitError, invalid, pristine, dirtySinceLastSubmit }) => (
        <Form onSubmit={handleSubmit} error>
          <Header as='h2' content='Login to Reactivities' color='teal' textAlign='center' />
          <Field name="email" component={TextInput} placeholder="Email" />
          <Field name="password" component={TextInput} placeholder="Password" type="password" />
          {submitError && !dirtySinceLastSubmit && (<ErrorMessage error={submitError} text='Invalid email or password' />)}
          <br />
          <Button disabled={(invalid && !dirtySinceLastSubmit) || pristine} loading={submitting} color='teal' content='Login' fluid />
          {/* display form states */}
          {/* <pre>{JSON.stringify(form.getState(), null, 2)}</pre> */}
        </Form>
      )}
    />
  );
};

export default LoginForm;
