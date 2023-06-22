import { Authenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import { Navigate } from 'react-router-dom';

export default function AuthForm() {
  return (
    <Authenticator>
      <Navigate to="/" replace={true} />
    </Authenticator>
  );
}
