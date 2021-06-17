import { useContext } from 'react';
import AppContext from '../../../../context/App/AppContext';

export default function useAmazonPayAppContext() {
  const [{ isLoggedIn }, { setErrorMessage, setPageLoader }] = useContext(
    AppContext
  );

  return {
    isLoggedIn,
    setPageLoader,
    setErrorMessage,
  };
}
