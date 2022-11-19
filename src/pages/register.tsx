import { Box, Button } from '@chakra-ui/react';
import { Form, Formik } from 'formik';
import React from 'react';
import { InputField, Wrapper } from '../components';
import { useRegisterMutation } from '../generated/graphql';

interface RegisterProps {}

const Register: React.FC<RegisterProps> = () => {
  const [, register] = useRegisterMutation();

  return (
    <Wrapper variant='small'>
      <Formik
        initialValues={{ userName: '', password: '' }}
        onSubmit={({ userName, password }) => {
          return register({
            userName: userName,
            password: password
          });
        }}
      >
        {({ values, isSubmitting }) => (
          <Form autoComplete='none'>
            <InputField
              label='UserName'
              name='userName'
              placeholder='UserName'
              value={values.userName}
            />
            <Box mt={4}>
              <InputField
                label='Password'
                name='password'
                placeholder='Password'
                type={'password'}
                value={values.password}
              />
            </Box>
            <Button mt={4} type='submit' isLoading={isSubmitting}>
              register
            </Button>
          </Form>
        )}
      </Formik>
    </Wrapper>
  );
};

export default Register;
