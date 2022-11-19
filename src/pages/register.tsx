import { Box, Button } from '@chakra-ui/react';
import { Form, Formik } from 'formik';
import React from 'react';
import { gql, useMutation } from 'urql';
import { InputField, Wrapper } from '../components';

interface RegisterProps {}

const Register: React.FC<RegisterProps> = () => {
  const REGISTER_MUT = gql`
    mutation Mutation($userName: String!, $password: String!) {
      createUser(options: { userName: $userName, password: $password }) {
        userName
      }
    }
  `;

  const [, register] = useMutation(REGISTER_MUT);

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
          <Form>
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
